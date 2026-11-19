import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@prisma/client';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '../auth.types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user || !user.permissions) {
      throw new ForbiddenException('Access denied. No authenticated user permissions found.');
    }

    // SUPER_ADMIN or admin:all has master permission
    if (user.roles.includes(RoleType.SUPER_ADMIN) || user.permissions.includes('admin:all')) {
      return true;
    }

    const hasAll = requiredPermissions.every((perm) => user.permissions.includes(perm));
    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient permission privileges. Required: [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
