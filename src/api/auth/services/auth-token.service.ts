import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import {
  ITokenPayload,
  IToken,
  IUserAuth,
  IAuthorizedUser,
} from '../interface/interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductConfigService } from '@core/config/services/config.service';
import { JWT_KEY } from '@core/config/constants/config.constant';

@Injectable()
export class AuthTokenService {
  private jwtAccessTokenSecretKey: string;
  private jwtRefreshTokenSecretKey: string;
  private jwtAccessTokenExpiresIn: string;
  private jwtRefreshTokenExpiresIn: string;
  private jwtRefreshTokenTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ProductConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtAccessTokenSecretKey = this.configService.get<string>(
      JWT_KEY.JWT_ACCESS_TOKEN_SECRET_KEY,
    );
    this.jwtRefreshTokenSecretKey = this.configService.get<string>(
      JWT_KEY.JWT_REFRESH_TOKEN_SECRET_KEY,
    );
    this.jwtAccessTokenExpiresIn = this.configService.get<string>(
      JWT_KEY.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    );
    this.jwtRefreshTokenExpiresIn = this.configService.get<string>(
      JWT_KEY.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    );
    this.jwtRefreshTokenTtl = this.configService.get<number>(
      JWT_KEY.JWT_REFRESH_TOKEN_TTL,
    );
  }

  async generateToken(payload: ITokenPayload | IUserAuth): Promise<IToken> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtAccessTokenSecretKey,
      expiresIn: this.jwtAccessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshTokenSecretKey,
      expiresIn: this.jwtRefreshTokenExpiresIn,
    });

    const targetId = payload.userId;
    await this.cacheManager.set(`Refresh/${targetId}`, refreshToken, {
      ttl: this.jwtRefreshTokenTtl,
    });

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(
    refreshToken: string,
    targetId: number,
  ): Promise<void> {
    const cachedRefreshToken = await this.cacheManager.get(
      `Refresh/${targetId}`,
    );
    if (!cachedRefreshToken) {
      throw new UnauthorizedException(
        `로그인 정보가 만료되었습니다. 다시 로그인해 주세요`,
        'ExpiredLoginInformation',
      );
    }

    if (refreshToken !== cachedRefreshToken) {
      await this.cacheManager.del(`Refresh/${targetId}`);
      throw new UnauthorizedException(
        `로그인 정보가 일치하지 않습니다. 다시 로그인해 주세요`,
        'InvalidLoginInformation',
      );
    }
  }

  async regenerateToken(authorizedUser: IAuthorizedUser): Promise<IToken> {
    await this.cacheManager.del(`Refresh/${authorizedUser.userId}`);

    return await this.generateToken(authorizedUser);
  }
}
