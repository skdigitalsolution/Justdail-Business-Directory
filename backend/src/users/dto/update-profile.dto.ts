import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Rajesh Kumar',
    required: false,
    description: 'User display name',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 'rajesh.kumar@example.com',
    required: false,
    description: 'Email address (optional)',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email format' })
  @MaxLength(255)
  email?: string;
}
