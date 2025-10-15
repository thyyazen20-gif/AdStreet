import { ApiProperty } from '@nestjs/swagger';

export class AuthSuccessDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT Refresh Token' })
  refreshToken: string;

  @ApiProperty({ example: 'customer', description: 'Type of the authenticated user' })
  userType: 'customer' | 'vendor' | 'admin';

  @ApiProperty({ example: '3600', description: 'Access Token expiration time in seconds' })
  expiresIn: number;
}

