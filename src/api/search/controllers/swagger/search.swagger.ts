import { ApiOperator } from '@src/types/type';
import { SearchController } from '../search.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { PlaceSearchResultDto } from '@api/search/dtos/response/place-search-result.dto';

export const ApiSearch: ApiOperator<keyof SearchController> = {
  SearchPlaces: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'SearchPlaces',
        PlaceSearchResultDto,
        { isArray: true },
      ),
    );
  },
};
