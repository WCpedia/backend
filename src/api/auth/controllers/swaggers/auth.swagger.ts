import { AuthTokenController } from '../auth-token.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { AuthController } from '../auth.controller';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { OauthSignupUserDto } from '@api/auth/dtos/responses/oauth-signup-user.dto';

export const ApiAuth: ApiOperator<keyof AuthController> = {
  SignInWithOauthProvider: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiCookieAuth('refreshToken'),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'RefreshTokens'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'OauthSignupUser',
        OauthSignupUserDto,
      ),
    );
  },
};
