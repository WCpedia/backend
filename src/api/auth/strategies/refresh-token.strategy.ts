import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenService } from '../services/auth-token.service';
import { ProductConfigService } from '@core/config/services/config.service';
import { JWT_KEY } from '@core/config/constants/config.constant';
import { Request } from 'express';
import { ITokenPayload } from '../interface/interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly configService: ProductConfigService,
    private readonly authTokenService: AuthTokenService,
  ) {
    super({
      secretOrKey: configService.get<string>(
        JWT_KEY.JWT_REFRESH_TOKEN_SECRET_KEY,
      ),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
    });
  }

  async validate({ userId, role }: ITokenPayload) {
    return { userId, role };
  }
}
