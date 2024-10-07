import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Authentication, Provider, User } from '@prisma/client';
import { ProductConfigService } from '@core/config/services/config.service';
import { AuthRepository } from '@api/auth/repository/auth.repository';
import { OAUTH_KEY, REDIS_KEY } from '@core/config/constants/config.constant';
import axios, { AxiosResponse } from 'axios';
import {
  IUserAuth,
  IKakaoUserProfile,
  IGoogleUserProfile,
  INaverUserProfile,
  AppleJwtTokenPayload,
  IOauthPayload,
} from '@api/auth/interface/interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SignUpWithOAuthProviderDto } from '../dtos/requests/oauth-signup-user.dto';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { AuthExceptionEnum } from '@exceptions/http/enums/global.exception.enum';
import { CustomBadRequest } from '@exceptions/http/custom-bad-request';
import { UserExceptionEnum } from '@exceptions/http/enums/user.exception.enum';
import { CustomNotFound } from '@exceptions/http/custom-not-found';
import { OAuthExceptionEnum } from '@exceptions/http/enums/oauth.exception.enum';

@Injectable()
export class AuthService {
  private kakaoGetUserUri: string;
  private googleGetUserUri: string;
  private naverGetUserUri: string;
  private redisTempAuthTtl: number;
  private appleGetUserUri: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly configService: ProductConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    this.kakaoGetUserUri = this.configService.get<string>(
      OAUTH_KEY.KAKAO_GET_USER_URI,
    );
    this.naverGetUserUri = this.configService.get<string>(
      OAUTH_KEY.NAVER_GET_USER_URI,
    );
    this.googleGetUserUri = this.configService.get<string>(
      OAUTH_KEY.GOOGLE_GET_USER_URI,
    );
    this.redisTempAuthTtl = this.configService.get<number>(
      REDIS_KEY.REDIS_TEMP_AUTH_TTL,
    );
    this.appleGetUserUri = this.configService.get<string>(
      OAUTH_KEY.APPLE_GET_USER_URI,
    );
  }
  /**
   * @todo oauth 로그인 시 이메일이 아닌 유저 식별용 아이디를 반환하는 로직 추가 필요
   */
  async signinWithOAuth(
    provider: Provider,
    accessToken: string,
  ): Promise<IOauthPayload | IUserAuth> {
    const oAuthPayload = await this.getOAuthUserProfile(provider, accessToken);

    const user = oAuthPayload.email
      ? await this.authRepository.getUserWithAuthByEmail(oAuthPayload.email)
      : await this.authRepository.getUserWithAuthByOAuthId(oAuthPayload);

    if (!user) {
      await this.cacheManager.set(
        `TempAuth/${oAuthPayload.providerUserId}`,
        provider,
        {
          ttl: this.redisTempAuthTtl,
        },
      );

      return oAuthPayload;
    }

    this.validateUser(user, provider);

    //삭제 예정
    await this.prismaService.authentication.update({
      where: { userId: user.id },
      data: {
        providerUserId: oAuthPayload.providerUserId,
      },
    });

    return { userId: user.id, role: user.role };
  }

  private async getKakaoUserProfile(
    accessToken: string,
  ): Promise<IOauthPayload> {
    try {
      const response: AxiosResponse<IKakaoUserProfile> = await axios.post(
        this.kakaoGetUserUri,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        provider: Provider.KAKAO,
        providerUserId: response.data.id.toString(),
        email: response.data.kakao_account.email,
      };
    } catch (error) {
      throw new CustomException(
        HttpExceptionStatusCode.INTERNAL_SERVER_ERROR,
        'OAuthServerError',
      );
    }
  }

  private async getGoogleUserProfile(
    accessToken: string,
  ): Promise<IOauthPayload> {
    try {
      const response: AxiosResponse<IGoogleUserProfile> = await axios.get(
        `${this.googleGetUserUri}${accessToken}`,
      );

      return {
        provider: Provider.GOOGLE,
        providerUserId: response.data.id,
        email: response.data.email,
      };
    } catch (error) {
      throw new CustomException(
        HttpExceptionStatusCode.INTERNAL_SERVER_ERROR,
        'OAuthServerError',
      );
    }
  }

  private async getNaverUserProfile(
    accessToken: string,
  ): Promise<IOauthPayload> {
    try {
      const response: AxiosResponse<INaverUserProfile> = await axios.get(
        this.naverGetUserUri,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return {
        provider: Provider.NAVER,
        providerUserId: response.data.response.id,
        email: response.data.response.email,
      };
    } catch (error) {
      throw new CustomException(
        HttpExceptionStatusCode.INTERNAL_SERVER_ERROR,
        'OAuthServerError',
      );
    }
  }

  private async getAppleUserProfile(
    appleIdToken: string,
  ): Promise<IOauthPayload> {
    try {
      // Apple ID 토큰을 디코드하여 헤더와 페이로드를 추출.
      const decodedToken = jwt.decode(appleIdToken, { complete: true }) as {
        header: { kid: string; alg: jwt.Algorithm };
        payload: { sub: string };
      };
      if (!decodedToken) {
        throw new CustomBadRequest(AuthExceptionEnum.INVALID_OAUTH_TOKEN);
      }

      // 토큰 헤더에서 키 ID를 추출.
      const keyIdFromToken = decodedToken.header.kid;

      // JWKS 클라이언트를 생성하여 Apple의 JWKS URI로 설정.
      const jwksClient = new JwksClient({ jwksUri: this.appleGetUserUri });

      // JWKS 클라이언트를 사용하여 해당 키 ID의 Signing Key 키를 가져옴.
      const key = await jwksClient.getSigningKey(keyIdFromToken);
      // 서명 키에서 공개 키를 추출.
      const publicKey = key.getPublicKey();

      // 공개 키를 사용하여 Apple ID 토큰을 검증하고 디코드된 토큰을 반환.
      const verifiedDecodedToken: AppleJwtTokenPayload = jwt.verify(
        appleIdToken,
        publicKey,
        {
          algorithms: [decodedToken.header.alg], // 사용할 알고리즘을 지정.
        },
      ) as AppleJwtTokenPayload;

      return {
        provider: Provider.APPLE,
        providerUserId: verifiedDecodedToken.sub,
        email: verifiedDecodedToken.email,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomException(
          HttpExceptionStatusCode.UNAUTHORIZED,
          'TokenVerificationFailed',
        );
      } else {
        throw new InternalServerErrorException('ServerError');
      }
    }
  }

  private async getOAuthUserProfile(
    provider: Provider,
    accessToken: string,
  ): Promise<IOauthPayload> {
    const profileMethods = {
      [Provider.KAKAO]: this.getKakaoUserProfile,
      [Provider.GOOGLE]: this.getGoogleUserProfile,
      [Provider.NAVER]: this.getNaverUserProfile,
      [Provider.APPLE]: this.getAppleUserProfile,
    };

    const getProfile = profileMethods[provider];
    if (!getProfile) {
      throw new CustomBadRequest(OAuthExceptionEnum.UNSUPPORTED_PROVIDER);
    }

    return getProfile.call(this, accessToken);
  }

  private validateUser(
    user: User & { authentication: Authentication },
    provider: Provider,
  ): void {
    if (user.deletedAt) {
      throw new CustomBadRequest(UserExceptionEnum.USER_DELETED);
    }

    if (user.authentication.provider !== provider) {
      throw new CustomBadRequest(AuthExceptionEnum.DIFFERENT_SIGNUP_PROVIDER);
    }
  }

  /**
   * @todo 클라이언트 변경내용 반영 완료시 tempAuth 조회 로직 수정 필요
   */
  async signUpWithOAuth(
    dto: SignUpWithOAuthProviderDto,
    profileImage: Express.MulterS3.File,
  ) {
    const tempAuth = await this.cacheManager.get(
      `TempAuth/${dto.email ? dto.email : dto.providerUserId}`,
    );
    if (!tempAuth) {
      throw new CustomNotFound(AuthExceptionEnum.TEMP_AUTH_NOT_FOUND);
    }
    if (tempAuth !== Provider[dto.provider]) {
      throw new CustomBadRequest(AuthExceptionEnum.INVALID_SIGNUP_INFORMATION);
    }

    await this.createUserAuth(dto, profileImage);
  }

  private async createUserAuth(
    dto: SignUpWithOAuthProviderDto,
    profileImage: Express.MulterS3.File,
  ) {
    const { nickname, description, ...authInputData } = dto;
    await this.prismaService.$transaction(async (transaction) => {
      const createdUser = await this.authRepository.createUser(
        {
          nickname,
          description,
          profileImageKey: profileImage?.key,
        },
        transaction,
      );

      await this.authRepository.createAuthentication(
        { userId: createdUser.id, ...authInputData },
        transaction,
      );
    });
  }
}
