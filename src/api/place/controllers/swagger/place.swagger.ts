import { ApiOperator } from '@src/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { PlaceController } from '@api/place/controllers/place.controller';
import { PlaceDetailDto } from '@api/place/dtos/response/place-detail.dto';

export const ApiPlace: ApiOperator<keyof PlaceController> = {
  GetPlace: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetPlace',
        PlaceDetailDto,
      ),
    );
  },
};
