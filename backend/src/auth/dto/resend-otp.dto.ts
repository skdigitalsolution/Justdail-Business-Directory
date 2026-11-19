import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeIndianMobile } from './request-otp.dto';

export class ResendOtpDto {
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
}
