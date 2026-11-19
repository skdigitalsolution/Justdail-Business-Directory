import {
  Injectable,
  Logger,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { RoleType, AccountStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms/sms.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { AuthenticatedUser } from './auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // Security Constants
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly RESEND_COOLDOWN_SECONDS = 60;
  private readonly MAX_HOURLY_OTP_REQUESTS = 5;
  private readonly SESSION_EXPIRY_DAYS = 7;

  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * Request OTP for login or registration
   */
  async requestOtp(
    dto: RequestOtpDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    success: boolean;
    message: string;
    cooldownSeconds: number;
    isDevelopment: boolean;
    devOtp?: string;
  }> {
    const mobile = dto.mobile;

    // 1. Hourly Rate Limit Check
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await this.prisma.otpChallenge.count({
      where: {
        mobile,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentCount >= this.MAX_HOURLY_OTP_REQUESTS) {
      this.logger.warn(`Rate limit triggered for mobile ${mobile}: ${recentCount} requests in last hour`);
      await this.logAudit({
        mobile,
        action: 'OTP_RATE_LIMITED',
        status: 'FAILURE',
        details: `Hourly threshold of ${this.MAX_HOURLY_OTP_REQUESTS} exceeded`,
        ipAddress,
        userAgent,
      });
      throw new HttpException(
        'Too many OTP requests. For security reasons, please try again after 1 hour.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Cooldown Check (60 seconds)
    const latestChallenge = await this.prisma.otpChallenge.findFirst({
      where: { mobile },
      orderBy: { createdAt: 'desc' },
    });

    if (latestChallenge) {
      const elapsedSeconds = Math.floor((Date.now() - latestChallenge.createdAt.getTime()) / 1000);
      if (elapsedSeconds < this.RESEND_COOLDOWN_SECONDS) {
        const remaining = this.RESEND_COOLDOWN_SECONDS - elapsedSeconds;
        throw new HttpException(
          `Please wait ${remaining} seconds before requesting a new verification code.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    // 3. Optional Terms & Privacy Consent Recording
    if (dto.consentAccepted) {
      await this.prisma.consentRecord.create({
        data: {
          mobile,
          consentType: 'TERMS_AND_PRIVACY_V1',
          ipAddress,
          userAgent,
        },
      });
    }

    // 4. Cryptographic 6-digit OTP & Per-Challenge Salt Generation
    const otp = crypto.randomInt(100000, 1000000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedOtp = crypto.createHash('sha256').update(salt + otp).digest('hex');
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    const existingUser = await this.prisma.user.findUnique({
      where: { mobile },
    });

    // 5. Store OtpChallenge
    await this.prisma.otpChallenge.create({
      data: {
        mobile,
        userId: existingUser?.id,
        hashedOtp,
        salt,
        expiresAt,
        maxAttempts: 3,
        purpose: existingUser ? 'LOGIN' : 'REGISTRATION',
        ipAddress,
        userAgent,
      },
    });

    // 6. Audit Logging
    await this.logAudit({
      userId: existingUser?.id,
      mobile,
      action: 'OTP_REQUESTED',
      status: 'SUCCESS',
      details: `Challenge created (Expires in ${this.OTP_EXPIRY_MINUTES} mins)`,
      ipAddress,
      userAgent,
    });

    // 7. Dispatch via SMS Provider Adapter
    await this.smsService.sendOtp(mobile, otp);

    const isDev = this.smsService.isDevMode();
    return {
      success: true,
      message: `Verification code sent to ${mobile}.`,
      cooldownSeconds: this.RESEND_COOLDOWN_SECONDS,
      isDevelopment: isDev,
      // Dev OTP returned in development mode to enable seamless automated testing
      ...(isDev ? { devOtp: otp } : {}),
    };
  }

  /**
   * Verify OTP and establish authenticated session
   */
  async verifyOtp(
    dto: VerifyOtpDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    sessionToken: string;
    user: AuthenticatedUser;
  }> {
    const mobile = dto.mobile;

    // 1. Fetch latest active, unconsumed challenge
    const challenge = await this.prisma.otpChallenge.findFirst({
      where: {
        mobile,
        isConsumed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!challenge || challenge.expiresAt <= new Date()) {
      await this.logAudit({
        mobile,
        action: 'OTP_VERIFICATION_FAILED',
        status: 'FAILURE',
        details: 'Challenge expired or not found',
        ipAddress,
        userAgent,
      });
      throw new BadRequestException('Verification code has expired or is invalid. Please request a new OTP.');
    }

    // 2. Max attempts check
    if (challenge.attempts >= challenge.maxAttempts) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { isConsumed: true },
      });
      await this.logAudit({
        mobile,
        action: 'OTP_VERIFICATION_FAILED',
        status: 'FAILURE',
        details: `Max attempts (${challenge.maxAttempts}) exceeded`,
        ipAddress,
        userAgent,
      });
      throw new BadRequestException('Maximum verification attempts exceeded. Please request a new OTP.');
    }

    // 3. Timing-safe OTP hash comparison
    const computedHash = crypto.createHash('sha256').update(challenge.salt + dto.otp).digest('hex');
    const isMatch = crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(challenge.hashedOtp));

    if (!isMatch) {
      const updatedChallenge = await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });

      const remainingAttempts = updatedChallenge.maxAttempts - updatedChallenge.attempts;

      await this.logAudit({
        mobile,
        action: 'OTP_VERIFICATION_FAILED',
        status: 'FAILURE',
        details: `Incorrect code entered. ${remainingAttempts} attempts remaining`,
        ipAddress,
        userAgent,
      });

      if (remainingAttempts <= 0) {
        await this.prisma.otpChallenge.update({
          where: { id: challenge.id },
          data: { isConsumed: true },
        });
        throw new BadRequestException('Maximum verification attempts exceeded. Please request a new OTP.');
      }

      throw new BadRequestException(`Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`);
    }

    // 4. Mark challenge as consumed (Replay Protection)
    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: {
        isConsumed: true,
        consumedAt: new Date(),
      },
    });

    // 5. Account resolution or registration
    let user = await this.prisma.user.findUnique({
      where: { mobile },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      // New consumer registration: strictly assign CONSUMER role per Section 3
      const consumerRole = await this.prisma.role.findUnique({
        where: { name: RoleType.CONSUMER },
      });

      if (!consumerRole) {
        throw new HttpException('System configuration error: CONSUMER role missing.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      user = await this.prisma.user.create({
        data: {
          mobile,
          name: dto.name || null,
          isMobileVerified: true,
          accountStatus: AccountStatus.ACTIVE,
          userRoles: {
            create: {
              roleId: consumerRole.id,
              assignedBy: 'SYSTEM_PUBLIC_SIGNUP',
            },
          },
        },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });

      await this.logAudit({
        userId: user.id,
        mobile,
        action: 'USER_REGISTERED',
        status: 'SUCCESS',
        details: 'New consumer account registered with CONSUMER role',
        ipAddress,
        userAgent,
      });
    } else {
      // Existing user validation
      if (user.accountStatus !== AccountStatus.ACTIVE) {
        await this.logAudit({
          userId: user.id,
          mobile,
          action: 'LOGIN_BLOCKED',
          status: 'FAILURE',
          details: `Account status is ${user.accountStatus}`,
          ipAddress,
          userAgent,
        });
        throw new ForbiddenException(`Account is not active (${user.accountStatus}). Contact support for assistance.`);
      }

      if (!user.isMobileVerified) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { isMobileVerified: true },
        });
      }
    }

    // 6. Generate Session Token & Store Session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const expiresAt = new Date(Date.now() + this.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const session = await this.prisma.authSession.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    // 7. Flatten Roles and Permissions
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissionSet = new Set<string>();
    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionSet.add(rp.permission.code);
      }
    }

    await this.logAudit({
      userId: user.id,
      mobile,
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      details: `Session established (Session ID: ${session.id})`,
      ipAddress,
      userAgent,
    });

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      email: user.email,
      accountStatus: user.accountStatus,
      isMobileVerified: user.isMobileVerified,
      roles,
      permissions: Array.from(permissionSet),
      sessionId: session.id,
    };

    return {
      sessionToken,
      user: authenticatedUser,
    };
  }

  /**
   * Resend OTP with cooldown enforcement
   */
  async resendOtp(
    dto: ResendOtpDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.requestOtp({ mobile: dto.mobile }, ipAddress, userAgent);
  }

  /**
   * Terminate active session
   */
  async logout(sessionId: string, userId?: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.prisma.authSession.updateMany({
      where: {
        id: sessionId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: 'USER_LOGOUT',
      },
    });

    await this.logAudit({
      userId,
      action: 'LOGOUT',
      status: 'SUCCESS',
      details: `Session revoked: ${sessionId}`,
      ipAddress,
      userAgent,
    });
  }

  private async logAudit(entry: {
    userId?: string;
    mobile?: string;
    action: string;
    status: 'SUCCESS' | 'FAILURE';
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await this.prisma.authAuditLog.create({
        data: {
          userId: entry.userId,
          mobile: entry.mobile,
          action: entry.action,
          status: entry.status,
          details: entry.details,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to record audit log: ${(err as Error).message}`);
    }
  }
}
