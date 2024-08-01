import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { BlockController } from '../controllers/block.controller';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';

export const ApiBlock: ApiOperator<keyof BlockController> = {
  GetBlockUserIds: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetBlockUserIds',
        Number,
        { isArray: true },
      ),
    );
  },
};
