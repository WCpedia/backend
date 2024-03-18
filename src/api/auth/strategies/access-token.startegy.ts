import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { ProductConfigService } from '@core/config/services/config.service';
import { JWT_KEY } from '@core/config/constants/config.constant';
import { ITokenPayload } from '../interface/interface';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(private readonly configService: ProductConfigService) {
    super({
      secretOrKey: configService.get<string>(
        JWT_KEY.JWT_ACCESS_TOKEN_SECRET_KEY,
      ),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
      ]),
    });
  }

  async validate({ userId, role }: ITokenPayload) {
    return { userId, role };
  }
}
