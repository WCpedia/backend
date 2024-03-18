import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptions,
  ApiResponse,
} from '@nestjs/swagger';

export class CommonResponseDto {
  static swaggerBuilder(
    status: Exclude<HttpStatus, ErrorHttpStatusCode>,
    key: string,
    type: Type,
    options: Omit<ApiPropertyOptions, 'name' | 'type'> = {},
  ) {
    class Temp extends this {
      @ApiProperty({
        name: 'status',
        example: `${status}`,
        enum: HttpStatus,
      })
      private readonly statusCode: number;

      @ApiProperty({
        name: 'data',
        type,
        ...options,
      })
      private readonly data: string;
    }

    Object.defineProperty(Temp, 'name', {
      value: `${key}ResponseDto`,
    });

    return applyDecorators(
      ApiExtraModels(type),
      ApiResponse({ status, type: Temp }),
    );
  }
}
