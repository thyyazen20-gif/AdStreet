import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'User password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'customer', description: 'Type of user', enum: ['customer', 'vendor'] })
  @IsEnum(['customer', 'vendor'])
  user_type: 'customer' | 'vendor';

  @ApiProperty({ example: 'John Doe', description: 'User name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '+966501234567', description: 'User phone number', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;
}

