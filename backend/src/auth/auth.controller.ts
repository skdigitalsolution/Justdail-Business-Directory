import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from './auth.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for mobile authentication' })
  @ApiResponse({ status: 200, description: 'OTP challenge generated and dispatched' })
  @ApiResponse({ status: 429, description: 'Rate limit or resend cooldown active' })
  async requestOtp(@Body() dto: RequestOtpDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.requestOtp(dto, ipAddress, userAgent);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and establish HttpOnly cookie session' })
  @ApiResponse({ status: 200, description: 'OTP verified, session cookie issued' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 403, description: 'Account suspended or inactive' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await this.authService.verifyOtp(dto, ipAddress, userAgent);

    const isProduction = process.env.NODE_ENV === 'production';
    // Issue secure HttpOnly cookie
    res.cookie('auth_session', result.sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      message: 'Authentication successful.',
      user: {
        id: result.user.id,
        mobile: result.user.mobile,
        name: result.user.name,
        email: result.user.email,
        accountStatus: result.user.accountStatus,
        isMobileVerified: result.user.isMobileVerified,
        roles: result.user.roles,
        permissions: result.user.permissions,
      },
      // In development mode, return sessionToken in body to facilitate testing via CLI/curl
      ...(!isProduction ? { sessionToken: result.sessionToken } : {}),
    };
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP to mobile number' })
  @ApiResponse({ status: 200, description: 'New OTP dispatched' })
  @ApiResponse({ status: 429, description: 'Cooldown period active' })
  async resendOtp(@Body() dto: ResendOtpDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.resendOtp(dto, ipAddress, userAgent);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile and roles' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        accountStatus: user.accountStatus,
        isMobileVerified: user.isMobileVerified,
        roles: user.roles,
        permissions: user.permissions,
      },
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Revoke active session and clear authentication cookie' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await this.authService.logout(user.sessionId, user.id, ipAddress, userAgent);

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('auth_session', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: true,
      message: 'Logged out successfully.',
    };
  }
}
