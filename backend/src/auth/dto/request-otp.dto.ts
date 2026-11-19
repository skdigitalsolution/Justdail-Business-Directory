import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export function normalizeIndianMobile(raw: string): string {
  if (!raw) return '';
  // Remove all spaces, dashes, parentheses
  let cleaned = raw.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (!cleaned.startsWith('+91')) {
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = '+' + cleaned;
    } else if (cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    }
  }
  return cleaned;
}

export class RequestOtpDto {
  @ApiProperty({
    example: '+919876543210',
    description: '10-digit Indian mobile number with country code (+91)',
  })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString()
  @Transform(({ value }) => normalizeIndianMobile(value))
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Mobile number must be a valid 10-digit Indian number with +91 prefix (e.g. +919876543210)',
  })
  mobile!: string;

  @ApiProperty({
    example: true,
    required: false,
    description: 'User consent for platform terms and communications',
  })
  @IsOptional()
  @IsBoolean()
  consentAccepted?: boolean;
}
