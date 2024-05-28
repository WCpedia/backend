import { Controller, Get, Param, Res, UseGuards, Delete } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthTokenService } from '../services/auth-token.service';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser, IToken, ITokenPayload } from '../interface/interface';
import { Role } from '@prisma/client';
import { ApiAuthToken } from './swaggers/auth-token.swagger';
import { RefreshTokenGuard } from '@api/common/guards/refresh-token.guard';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';

@ApiTags(DOMAIN_NAME.AUTH_TOKEN)
@Controller(DOMAIN_NAME.AUTH_TOKEN)
export class AuthTokenController {
  constructor(private readonly authTokenService: AuthTokenService) {}

  @ApiAuthToken.GetAccessToken({ summary: '테스트용 토큰 발급' })
  @Get('/test/:userId')
  async getAccessToken(
    @Param('userId') userId: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const token = await this.authTokenService.generateToken({
      userId,
      role: Role.ADMIN,
    });

    response.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      sameSite: 'none',
    });
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
    });
  }

  @ApiAuthToken.RefreshTokens({ summary: '토큰 재발급' })
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const token: IToken =
      await this.authTokenService.regenerateToken(authorizedUser);

    response.cookie('accessToken', token.accessToken, {
      httpOnly: true,
    });
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });
  }

  @ApiAuthToken.RevokeTokens({ summary: '모든 토큰 초기화' })
  @Delete('/revoke')
  async revokeTokens(
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
  }
}
