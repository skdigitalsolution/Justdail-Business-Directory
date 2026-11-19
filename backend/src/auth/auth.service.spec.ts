import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RoleType, AccountStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms/sms.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let smsService: any;

  beforeEach(async () => {
    prisma = {
      otpChallenge: {
        count: jest.fn().mockResolvedValue(0),
        findFirst: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'challenge-1' }),
        update: jest.fn().mockResolvedValue({ id: 'challenge-1' }),
      },
      consentRecord: {
        create: jest.fn().mockResolvedValue({ id: 'consent-1' }),
      },
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      role: {
        findUnique: jest.fn(),
      },
      authSession: {
        create: jest.fn().mockResolvedValue({ id: 'session-1' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      authAuditLog: {
        create: jest.fn().mockResolvedValue({ id: 'log-1' }),
      },
    };

    smsService = {
      sendOtp: jest.fn().mockResolvedValue({ success: true, isDevelopment: true }),
      isDevMode: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: SmsService, useValue: smsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestOtp', () => {
    it('should generate and dispatch OTP when no cooldown or rate limits active', async () => {
      prisma.otpChallenge.count.mockResolvedValue(1);
      prisma.otpChallenge.findFirst.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await service.requestOtp({ mobile: '+919876543210' });

      expect(res.success).toBe(true);
      expect(res.cooldownSeconds).toBe(60);
      expect(smsService.sendOtp).toHaveBeenCalled();
      expect(prisma.otpChallenge.create).toHaveBeenCalled();
    });

    it('should throw 429 when requesting OTP within 60s cooldown window', async () => {
      prisma.otpChallenge.count.mockResolvedValue(1);
      prisma.otpChallenge.findFirst.mockResolvedValue({
        id: 'challenge-old',
        createdAt: new Date(Date.now() - 30 * 1000), // 30s ago
      });

      await expect(service.requestOtp({ mobile: '+919876543210' })).rejects.toThrow(HttpException);
    });

    it('should throw 429 when hourly rate limit is exceeded', async () => {
      prisma.otpChallenge.count.mockResolvedValue(5);

      await expect(service.requestOtp({ mobile: '+919876543210' })).rejects.toThrow(HttpException);
    });
  });

  describe('verifyOtp', () => {
    it('should successfully verify OTP, register consumer, and issue session token', async () => {
      const salt = 'testsalt1234';
      const otp = '123456';
      const hashedOtp = crypto.createHash('sha256').update(salt + otp).digest('hex');

      prisma.otpChallenge.findFirst.mockResolvedValue({
        id: 'chal-1',
        mobile: '+919876543210',
        salt,
        hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        maxAttempts: 3,
        isConsumed: false,
      });

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue({ id: 'role-consumer', name: RoleType.CONSUMER });
      prisma.user.create.mockResolvedValue({
        id: 'user-new',
        mobile: '+919876543210',
        name: 'New User',
        email: null,
        accountStatus: AccountStatus.ACTIVE,
        isMobileVerified: true,
        userRoles: [
          {
            role: {
              name: RoleType.CONSUMER,
              rolePermissions: [{ permission: { code: 'profile:read' } }],
            },
          },
        ],
      });

      const res = await service.verifyOtp({ mobile: '+919876543210', otp: '123456' });

      expect(res.sessionToken).toBeDefined();
      expect(res.user.mobile).toBe('+919876543210');
      expect(res.user.roles).toContain(RoleType.CONSUMER);
      expect(prisma.otpChallenge.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'chal-1' },
          data: expect.objectContaining({ isConsumed: true }),
        }),
      );
    });

    it('should reject invalid OTP and increment attempt counter', async () => {
      const salt = 'testsalt1234';
      const realOtp = '123456';
      const hashedOtp = crypto.createHash('sha256').update(salt + realOtp).digest('hex');

      prisma.otpChallenge.findFirst.mockResolvedValue({
        id: 'chal-1',
        mobile: '+919876543210',
        salt,
        hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 1,
        maxAttempts: 3,
        isConsumed: false,
      });

      prisma.otpChallenge.update.mockResolvedValue({
        id: 'chal-1',
        attempts: 2,
        maxAttempts: 3,
      });

      await expect(
        service.verifyOtp({ mobile: '+919876543210', otp: '999999' }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.otpChallenge.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'chal-1' },
          data: { attempts: { increment: 1 } },
        }),
      );
    });

    it('should reject expired challenge', async () => {
      prisma.otpChallenge.findFirst.mockResolvedValue({
        id: 'chal-1',
        mobile: '+919876543210',
        expiresAt: new Date(Date.now() - 1000), // Expired
        isConsumed: false,
      });

      await expect(
        service.verifyOtp({ mobile: '+919876543210', otp: '123456' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('should revoke active session', async () => {
      await service.logout('session-1', 'user-1');

      expect(prisma.authSession.updateMany).toHaveBeenCalledWith({
        where: { id: 'session-1', isRevoked: false },
        data: expect.objectContaining({ isRevoked: true, revocationReason: 'USER_LOGOUT' }),
      });
    });
  });
});
