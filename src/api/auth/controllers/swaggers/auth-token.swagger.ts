import { AuthTokenController } from '../auth-token.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';

export const ApiAuthToken: ApiOperator<keyof AuthTokenController> = {
  GetAccessToken: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'GetAccessToken'),
    );
  },

  RefreshTokens: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('refreshToken'),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'RefreshTokens'),
    );
  },
};
