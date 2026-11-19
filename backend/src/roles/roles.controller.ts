import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { RolesService } from './roles.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/auth.types';

@ApiTags('Roles & Access Control')
@Controller('roles')
@UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
@ApiCookieAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(RoleType.SUPER_ADMIN)
  @Permissions('roles:manage')
  @ApiOperation({ summary: 'List all platform roles and permissions (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all system roles and permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient privileges' })
  async getRoles() {
    const roles = await this.rolesService.getAllRoles();
    return {
      success: true,
      roles,
    };
  }

  @Get('merchant-check')
  @Roles(RoleType.BUSINESS_OWNER, RoleType.MERCHANT_STAFF)
  @ApiOperation({ summary: 'Test endpoint verifying merchant role boundaries' })
  @ApiResponse({ status: 200, description: 'Merchant access confirmed' })
  @ApiResponse({ status: 403, description: 'Forbidden: Consumer or non-merchant' })
  async checkMerchantAccess(@CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      message: 'Access granted to merchant portal boundary.',
      userId: user.id,
      roles: user.roles,
    };
  }

  @Get('admin-check')
  @Roles(
    RoleType.SUPER_ADMIN,
    RoleType.CONTENT_MODERATOR,
    RoleType.VERIFICATION_OFFICER,
    RoleType.SALES_SUPPORT_AGENT,
    RoleType.FINANCE_MANAGER,
  )
  @ApiOperation({ summary: 'Test endpoint verifying staff & admin role boundaries' })
  @ApiResponse({ status: 200, description: 'Staff/Admin access confirmed' })
  @ApiResponse({ status: 403, description: 'Forbidden: Non-admin user' })
  async checkAdminAccess(@CurrentUser() user: AuthenticatedUser) {
    return {
      success: true,
      message: 'Access granted to administrative portal boundary.',
      userId: user.id,
      roles: user.roles,
    };
  }
}
