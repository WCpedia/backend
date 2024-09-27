import { ApiOperator } from '@src/types/type';
import { SearchController } from '../search.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';

export const ApiSearch: ApiOperator<keyof SearchController> = {
  SearchPlaces: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'SearchPlaces',
        BasicPlaceDto,
        { isArray: true },
      ),
    );
  },
  Test1: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(ApiOperation(apiOperationOptions));
  },
  Test2: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(ApiOperation(apiOperationOptions));
  },
};
