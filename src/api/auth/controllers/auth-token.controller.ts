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
import { TOKEN_TYPE } from '@src/constants/consts/token-type.const';

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
    await this.authTokenService.generateToken(response, {
      userId,
      role: Role.ADMIN,
    });
  }

  @ApiAuthToken.RefreshTokens({ summary: '토큰 재발급' })
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authTokenService.regenerateToken(response, authorizedUser);
  }

  @ApiAuthToken.RevokeTokens({ summary: '모든 토큰 초기화' })
  @Delete('/revoke')
  async revokeTokens(
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    response.clearCookie(TOKEN_TYPE.ACCESS_TOKEN);
    response.clearCookie(TOKEN_TYPE.REFRESH_TOKEN);
  }
}
