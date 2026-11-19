import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/auth.types';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Profile details with roles and permissions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.usersService.getProfile(user.id);
    return {
      success: true,
      profile,
    };
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update permitted profile fields (display name, email)' })
  @ApiResponse({ status: 200, description: 'Updated profile details' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.usersService.updateProfile(user.id, dto);
    return {
      success: true,
      message: 'Profile updated successfully.',
      profile: updated,
    };
  }
}
