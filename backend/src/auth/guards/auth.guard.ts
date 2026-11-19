import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthenticatedUser } from '../auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication session required. Please log in.');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const session = await this.prisma.authSession.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session || session.isRevoked || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Session has expired or has been revoked. Please log in again.');
    }

    if (session.user.accountStatus !== 'ACTIVE') {
      throw new ForbiddenException(`Account is not active. Status: ${session.user.accountStatus}`);
    }

    // Touch lastActiveAt asynchronously
    this.prisma.authSession
      .update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() },
      })
      .catch(() => null);

    const roles = session.user.userRoles.map((ur) => ur.role.name);
    const permissionSet = new Set<string>();
    for (const ur of session.user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionSet.add(rp.permission.code);
      }
    }

    const authenticatedUser: AuthenticatedUser = {
      id: session.user.id,
      mobile: session.user.mobile,
      name: session.user.name,
      email: session.user.email,
      accountStatus: session.user.accountStatus,
      isMobileVerified: session.user.isMobileVerified,
      roles,
      permissions: Array.from(permissionSet),
      sessionId: session.id,
    };

    request.user = authenticatedUser;
    return true;
  }

  private extractToken(request: any): string | null {
    // 1. HttpOnly Cookie (Primary)
    if (request.cookies && request.cookies['auth_session']) {
      return request.cookies['auth_session'];
    }

    // 2. Authorization Header Bearer token (Secondary / API Clients)
    const authHeader = request.headers?.authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7).trim();
    }

    return null;
  }
}
