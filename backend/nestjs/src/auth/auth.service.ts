import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthSuccessDto } from './dto/auth-success.dto';
import { Session } from '../sessions/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthSuccessDto> {
    const existingUser = await this.usersRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.usersRepository.create({
      email: registerDto.email,
      passwordHash: hashedPassword,
      name: registerDto.name,
      phoneNumber: registerDto.phone_number,
      userType: registerDto.user_type,
    });

    await this.usersRepository.save(newUser);

    return this.generateTokens(newUser);
  }

  async login(loginDto: LoginDto): Promise<AuthSuccessDto> {
    const user = await this.usersRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthSuccessDto> {
    const session = await this.sessionsRepository.findOne({ where: { refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepository.findOne({ where: { id: session.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Invalidate old refresh token
    await this.sessionsRepository.remove(session);

    return this.generateTokens(user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // TODO: Implement email sending for password reset
    console.log(`Password reset email sent to ${email}`);
  }

  async socialLogin(socialUser: any): Promise<AuthSuccessDto> {
    let user = await this.usersRepository.findOne({ where: { email: socialUser.email } });

    if (!user) {
      // Register new user if not found
      user = this.usersRepository.create({
        email: socialUser.email,
        name: socialUser.firstName + (socialUser.lastName ? ` ${socialUser.lastName}` : ""),
        // Social logins don't have passwords, so we can set a placeholder or handle it differently
        passwordHash: "", 
        userType: "customer", // Default user type for social logins
      });
      await this.usersRepository.save(user);
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<AuthSuccessDto> {
    const payload = { email: user.email, sub: user.id, userType: user.userType };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Short-lived access token
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Longer-lived refresh token

    const newSession = this.sessionsRepository.create({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    await this.sessionsRepository.save(newSession);

    return {
      accessToken,
      refreshToken,
      userType: user.userType,
      expiresIn: 15 * 60, // 15 minutes
    };
  }
}

