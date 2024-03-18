import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { AuthRepository } from '../repository/auth.repository';
import {
  IUserAuth,
  IGoogleUserProfile,
  IKakaoUserProfile,
  INaverUserProfile,
} from '../interface/interface';
import { Provider } from '@prisma/client';
import { ProductConfigService } from '@core/config/services/config.service';
import { OAUTH_KEY } from '@core/config/constants/config.constant';

@Injectable()
export class AuthOAuthService {
  private kakaoGetUserUri: string;
  private googleGetUserUri: string;
  private naverGetUserUri: string;

  constructor(
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
  }

  async signIn(provider: string, accessToken: string): Promise<IUserAuth> {
    let userEmail: string;

    switch (provider) {
      case Provider.KAKAO:
        userEmail = await this.getKakaoUserEmail(accessToken);
        break;
      case Provider.GOOGLE:
        userEmail = await this.getGoogleUserEmail(accessToken);
        break;
      case Provider.NAVER:
        userEmail = await this.getNaverUserEmail(accessToken);
        break;
    }

    const selectedUser = await this.authRepository.getUserWithAuth(userEmail);

    if (!selectedUser) {
      return { userEmail };
    }

    if (selectedUser.authentication.provider !== Provider[provider]) {
      throw new BadRequestException(
        `다른 방식으로 가입된 이메일 입니다.`,
        'differentSignUpMethod',
      );
    }

    return { userId: selectedUser.id };
  }

  private async getKakaoUserEmail(accessToken: string): Promise<string> {
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

      return response.data.kakao_account.email;
    } catch (error) {
      throw new InternalServerErrorException(
        'OAuth 서버 요청 오류입니다.',
        'oAuthServerError',
      );
    }
  }

  private async getGoogleUserEmail(accessToken: string): Promise<string> {
    try {
      const response: AxiosResponse<IGoogleUserProfile> = await axios.get(
        `${this.googleGetUserUri}${accessToken}`,
      );

      return response.data.email;
    } catch (error) {
      throw new InternalServerErrorException(
        'OAuth 서버 요청 오류입니다.',
        'oAuthServerError',
      );
    }
  }

  private async getNaverUserEmail(accessToken: string): Promise<string> {
    try {
      const response: AxiosResponse<INaverUserProfile> = await axios.get(
        this.naverGetUserUri,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data.response.email;
    } catch (error) {
      throw new InternalServerErrorException(
        'OAuth 서버 요청 오류입니다.',
        'oAuthServerError',
      );
    }
  }
}
