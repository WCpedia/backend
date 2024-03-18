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
import { ProviderValidator } from '../validaters/auth-provider.validator';
import { Provider } from '@prisma/client';
import { ApiAuth } from './swaggers/auth.swagger';
import { OauthSignupUserDto } from '../dtos/responses/oauth-signup-user.dto';
import { plainToInstance } from 'class-transformer';

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
    const user: IUserAuth = await this.authService.signInWithOAuth(
      provider,
      accessToken,
    );

    if (user.userEmail) {
      const signupUser = plainToInstance(OauthSignupUserDto, user);

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
}
