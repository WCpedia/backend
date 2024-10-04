import {
  AuthExceptionEnum,
  AuthExceptionMessage,
} from '@exceptions/http/enums/global.exception.enum';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiResponse } from '@nestjs/swagger';
import { TOKEN_TYPE } from '@src/constants/consts/token-type.const';

export class TokenConfigDto {
  static swaggerBuilder(type: string = TOKEN_TYPE.ACCESS_TOKEN) {
    const examples = Object.keys(AuthExceptionEnum).reduce((acc, key) => {
      const errorCode = AuthExceptionEnum[key];
      const description = AuthExceptionMessage[errorCode];
      acc[errorCode] = {
        value: {
          statusCode: HttpExceptionStatusCode.UNAUTHORIZED,
          errorCode: errorCode,
          description,
        },
      };
      return acc;
    }, {});

    return applyDecorators(
      ApiCookieAuth(type),
      ApiResponse({
        status: HttpExceptionStatusCode.UNAUTHORIZED,
        description:
          '**주의🚨 description은 해당 에러에 대한 설명입니다. 실제 반환값에는 포함되지 않습니다**',
        content: {
          'application-json': {
            examples,
          },
        },
      }),
    );
  }
}
