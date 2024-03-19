import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Provider } from '@prisma/client';
import { ProductConfigService } from '@core/config/services/config.service';
import { AuthRepository } from '@api/auth/repository/auth.repository';
import { OAUTH_KEY, REDIS_KEY } from '@core/config/constants/config.constant';
import axios, { AxiosResponse } from 'axios';
import {
  IUserAuth,
  IKakaoUserProfile,
  IGoogleUserProfile,
  INaverUserProfile,
} from '@api/auth/interface/interface';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { SignUpWithOAuthProviderDto } from '../dtos/requests/oauth-signup-user.dto';
import { PrismaService } from '@core/database/prisma/services/prisma.service';

@Injectable()
export class AuthService {
  private kakaoGetUserUri: string;
  private googleGetUserUri: string;
  private naverGetUserUri: string;
  private tempAuthTtl: number;

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
    this.tempAuthTtl = this.configService.get<number>(REDIS_KEY.TEMP_AUTH_TTL);
  }

  async signinWithOAuth(
    provider: Provider,
    accessToken: string,
  ): Promise<IUserAuth> {
    let email: string;
    switch (provider) {
      case Provider.KAKAO:
        email = await this.getKakaoUserEmail(accessToken);
        break;
      case Provider.GOOGLE:
        email = await this.getGoogleUserEmail(accessToken);
        break;
      case Provider.NAVER:
        email = await this.getNaverUserEmail(accessToken);
        break;
    }

    const user = await this.authRepository.getUserWithAuth(email);

    if (!user) {
      await this.cacheManager.set(
        `TempAuth/${email}`,
        provider,
        this.tempAuthTtl,
      );
      return { email, provider };
    }

    if (user.authentication.provider !== Provider[provider]) {
      throw new BadRequestException(
        `다른 방식으로 가입된 이메일 입니다.`,
        'DifferentSignUpMethod',
      );
    }

    return { userId: user.id, role: user.role };
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
        'OAuthServerError',
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
        'OAuthServerError',
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
        'OAuthServerError',
      );
    }
  }

  // async createUserAuth({
  //   userId,
  //   authEmail,
  //   signUpType,
  // }: CreateUserAuthDto): Promise<void> {
  //   const mappedSignUpType: SignUpType = this.mapSignUpType(signUpType);
  //   await this.validateUserAuth(userId);

  //   const authData: AuthInputData = {
  //     userId,
  //     email: authEmail,
  //     signUpTypeId: mappedSignUpType,
  //   };

  //   await this.prismaService.auth.create({ data: authData });
  // }

  // async trxCreateUserAuth(
  //   tx: PrismaTransaction,
  //   { userId, authEmail, signUpType }: CreateUserAuthDto,
  // ): Promise<any> {
  //   const mappedSignUpType: SignUpType = this.mapSignUpType(signUpType);
  //   await this.trxValidateUserAuth(tx, userId, authEmail);

  //   const authData: AuthInputData = {
  //     userId,
  //     email: authEmail,
  //     signUpTypeId: mappedSignUpType,
  //   };

  //   return await tx.auth.create({ data: authData });
  // }

  // private async validateUserAuth(userId: number): Promise<void> {
  //   try {
  //     const selectedUser: Users = await this.prismaService.users.findUnique({
  //       where: { id: userId },
  //     });

  //     if (!selectedUser) {
  //       throw new NotFoundException(
  //         '존재하지 않는 유저 데이터입니다.',
  //         'notFoundUserData',
  //       );
  //     }
  //     if (selectedUser.deletedAt) {
  //       throw new BadRequestException(
  //         '유효하지 않은 유저 정보 요청입니다.',
  //         'invalidUserInformation',
  //       );
  //     }

  //     const selectedUserAuth: Auth | null =
  //       await this.prismaService.auth.findUnique({
  //         where: { userId: selectedUser.id },
  //       });
  //     if (selectedUserAuth) {
  //       throw new BadRequestException(
  //         '이미 가입되어있는 유저입니다.',
  //         'alreadyExistUser',
  //       );
  //     }
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

  // private async trxValidateUserAuth(
  //   tx: PrismaTransaction,
  //   userId: number,
  //   authEmail: string,
  // ): Promise<void> {
  //   try {
  //     const selectedUser: Users = await tx.users.findUnique({
  //       where: { id: userId },
  //     });

  //     if (!selectedUser) {
  //       throw new NotFoundException(
  //         '존재하지 않는 유저 데이터입니다.',
  //         'notFoundUserData',
  //       );
  //     }
  //     if (selectedUser.deletedAt) {
  //       throw new BadRequestException(
  //         '유효하지 않은 유저 정보 요청입니다.',
  //         'invalidUserInformation',
  //       );
  //     }

  //     const selectedUserAuth: Auth | null = await tx.auth.findUnique({
  //       where: { userId: selectedUser.id },
  //     });
  //     if (selectedUserAuth) {
  //       throw new BadRequestException(
  //         '이미 가입되어있는 유저입니다.',
  //         'alreadyExistUser',
  //       );
  //     }

  //     const selectedEmailAuth: Auth | null = await tx.auth.findUnique({
  //       where: { email: authEmail },
  //     });
  //     if (selectedEmailAuth) {
  //       throw new BadRequestException('이미 가입된 이메일입니다.');
  //     }
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   }
  // }

  // private mapSignUpType(signUpTypeString): SignUpType {
  //   let mappedSignUpType: SignUpType;

  //   switch (signUpTypeString) {
  //     case 'KAKAO':
  //       mappedSignUpType = SignUpType.KAKAO;
  //       break;
  //     case 'GOOGLE':
  //       mappedSignUpType = SignUpType.GOOGLE;
  //       break;
  //     case 'NAVER':
  //       mappedSignUpType = SignUpType.NAVER;
  //       break;
  //     default:
  //       throw new BadRequestException(
  //         '잘못된 SignUpType 입니다.',
  //         'invalidSignUpType',
  //       );
  //   }

  //   return mappedSignUpType;
  // }

  async signUpWithOAuth(dto: SignUpWithOAuthProviderDto) {
    const tempAuth = await this.cacheManager.get(`TempAuth/${dto.email}`);
    if (!tempAuth) {
      throw new NotFoundException(`가입 정보 만료`);
    }
    if (tempAuth !== Provider[dto.provider]) {
      throw new BadRequestException(`가입 정보가 일치하지 않습니다.`);
    }

    await this.createUserAuth(dto);
  }

  private async createUserAuth(dto: SignUpWithOAuthProviderDto) {
    const { nickname, description, profileUrlKey, ...authInputDate } = dto;
    await this.prismaService.$transaction(async (transaction) => {
      const createdUser = await this.authRepository.createUser(
        {
          nickname,
          description,
          profileUrlKey,
        },
        transaction,
      );

      await this.authRepository.createAuthentication(
        { userId: createdUser.id, ...authInputDate },
        transaction,
      );
    });
  }
}
