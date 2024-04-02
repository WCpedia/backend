import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptions,
} from '@nestjs/swagger';

export class MultipartFormDataRequestDto {
  static swaggerBuilder(
    key: string,
    imageKey: string,
    type: Type,
    options: Omit<ApiPropertyOptions, 'name' | 'type'> = {},
  ) {
    class Temp extends this {
      @ApiProperty({
        name: imageKey,
        type: 'string',
        format: 'binary',
        ...options,
      })
      private readonly image: string;

      @ApiProperty({
        name: 'data',
        type,
      })
      private readonly data: string;
    }

    Object.defineProperty(Temp, 'name', {
      value: `${key}FormDataDto`,
    });

    return applyDecorators(
      ApiConsumes('multipart/form-data'),
      ApiBody({
        type: Temp,
      }),
      ApiConsumes('application/json'),
      ApiBody({
        type,
      }),
    );
  }
}
