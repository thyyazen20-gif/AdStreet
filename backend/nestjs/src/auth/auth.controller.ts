import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthSuccessDto } from './dto/auth-success.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthSuccessDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthSuccessDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: AuthSuccessDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthSuccessDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: AuthSuccessDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthSuccessDto> {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Get("google")
  @ApiOperation({ summary: "Authenticate with Google" })
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow
  }

  @Get("google/redirect")
  @ApiOperation({ summary: "Google OAuth2 callback" })
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req): Promise<AuthSuccessDto> {
    return this.authService.socialLogin(req.user);
  }

  @Get("apple")
  @ApiOperation({ summary: "Authenticate with Apple" })
  @UseGuards(AuthGuard("apple"))
  async appleAuth(@Req() req) {
    // Initiates the Apple OAuth2 login flow
  }

  @Post("apple/redirect") // Apple uses POST for callback
  @ApiOperation({ summary: "Apple OAuth2 callback" })
  @UseGuards(AuthGuard("apple"))
  async appleAuthRedirect(@Req() req): Promise<AuthSuccessDto> {
    return this.authService.socialLogin(req.user);
  }
}
