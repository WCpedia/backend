import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export class ExceptionResponseDto {
  [key: string]: unknown;

  static swaggerBuilder(
    status: HttpExceptionStatusCode,
    errors: { errorCode: string; description: string }[],
  ) {
    const examples = {};

    errors.forEach(({ errorCode, description }) => {
      examples[errorCode] = {
        value: { statusCode: status, errorCode, description },
      };
    });

    return applyDecorators(
      ApiResponse({
        status,
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
