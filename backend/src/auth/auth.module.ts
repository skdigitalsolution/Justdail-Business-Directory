import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SmsService } from './sms/sms.service';
import { DevSmsAdapter } from './sms/dev-sms.adapter';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SmsService,
    DevSmsAdapter,
    AuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [AuthService, AuthGuard, RolesGuard, PermissionsGuard],
})
export class AuthModule {}
