import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      privateKeyString: configService.get<string>('APPLE_PRIVATE_KEY'),
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const user = {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}

