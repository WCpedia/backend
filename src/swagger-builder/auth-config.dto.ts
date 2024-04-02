import { AuthExceptionEnum } from '@exceptions/http/enums/global.exception.enum';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse } from '@nestjs/swagger';

export class TokenConfigDto {
  static swaggerBuilder(type: string) {
    const examples = Object.keys(AuthExceptionEnum).reduce((acc, key) => {
      const errorCode = AuthExceptionEnum[key];
      acc[errorCode] = {
        value: {
          statusCode: HttpExceptionStatusCode.UNAUTHORIZED,
          errorCode: errorCode,
        },
      };
      return acc;
    }, {});

    return applyDecorators(
      ApiCookieAuth(type),
      ApiResponse({
        status: HttpExceptionStatusCode.UNAUTHORIZED,
        content: {
          'application-json': {
            examples,
          },
        },
      }),
    );
  }
}
