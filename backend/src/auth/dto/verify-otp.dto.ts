import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeIndianMobile } from './request-otp.dto';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+919876543210',
    description: '10-digit Indian mobile number with country code (+91)',
  })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString()
  @Transform(({ value }) => normalizeIndianMobile(value))
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Mobile number must be a valid 10-digit Indian number with +91 prefix',
  })
  mobile!: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit numeric OTP sent via SMS',
  })
  @IsNotEmpty({ message: 'OTP is required' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
  otp!: string;

  @ApiProperty({
    example: 'Aarav Sharma',
    required: false,
    description: 'Full name for new user registration',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
