import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserAuth, IToken } from '../interface/interface';
import { AuthService } from '../services/auth.service';
import { AuthTokenService } from '../services/auth-token.service';
import { Response } from 'express';
import { ProviderValidator } from '../validators/auth-provider.validator';
import { Provider } from '@prisma/client';
import { ApiAuth } from './swaggers/auth.swagger';
import { NewUserOauthDto } from '../dtos/responses/new-user-oauth.dto';
import { plainToInstance } from 'class-transformer';
import { SignUpWithOAuthProviderDto } from '../dtos/requests/oauth-signup-user.dto';
import { UploadImages } from '@src/utils/image-upload-interceptor';
import {
  UploadFileLimit,
  FilePath,
} from '@src/constants/consts/upload-file.const';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';

@ApiTags(DOMAIN_NAME.AUTH)
@Controller(DOMAIN_NAME.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  @ApiAuth.SignInWithOauthProvider({
    summary: 'OAuth 로그인 kakao, google, naver',
  })
  @Get('signin/oauth/:provider')
  async signInWithOauthProvider(
    @Param('provider', ProviderValidator) provider: Provider,
    @Query('access-token')
    accessToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user: IUserAuth = await this.authService.signinWithOAuth(
      provider,
      accessToken,
    );

    if (user.email) {
      const signupUser = plainToInstance(NewUserOauthDto, user);

      return {
        statusCode: HttpStatus.CREATED,
        ...signupUser,
      };
    } else {
      await this.authTokenService.generateToken(response, user);
    }
  }

  @ApiAuth.SignUpWithOAuthProvider({
    summary: '회원가입',
  })
  @UploadImages({
    maxCount: UploadFileLimit.SINGLE,
    path: FilePath.USER,
  })
  @Post('signup')
  async signUpWithOAuthProvider(
    @UploadedFile() profileImage: Express.MulterS3.File,
    @Body() signUpWithOAuthProviderDto: SignUpWithOAuthProviderDto,
  ) {
    if (signUpWithOAuthProviderDto.provider === Provider.LOCAL) {
    } else {
      await this.authService.signUpWithOAuth(
        signUpWithOAuthProviderDto,
        profileImage,
      );
    }
  }
}
