import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOperationOptions } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { BlockController } from '../controllers/block.controller';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { PaginationResponseDto } from '@src/swagger-builder/pagination-response.dto';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';

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

  GetBlockUserProfiles: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'blockedUserProfiles',
        BasicUserDto,
      ),
    );
  },

  DeleteBlock: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'DeleteBlock'),
    );
  },

  CreateBlock: function (
    apiOperationOptions: Required<Pick<ApiOperationOptions, 'summary'>> &
      ApiOperationOptions,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'CreateBlock'),
    );
  },
};
