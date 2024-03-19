import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
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

@ApiTags('Auth')
@Controller('auth')
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
      const token: IToken = await this.authTokenService.generateToken(user);

      response.cookie('accessToken', token.accessToken, {
        httpOnly: true,
      });
      response.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
      });
    }
  }

  @ApiAuth.SignUpWithOAuthProvider({
    summary: 'OAuth를 통한 가입',
  })
  @Post('signup/oauth')
  async signUpWithOAuthProvider(
    @Body() signUpWithOAuthProviderDto: SignUpWithOAuthProviderDto,
  ) {
    if (signUpWithOAuthProviderDto.provider === Provider.LOCAL) {
    } else {
      await this.authService.signUpWithOAuth(signUpWithOAuthProviderDto);
    }
  }
}
