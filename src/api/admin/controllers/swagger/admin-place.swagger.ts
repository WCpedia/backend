import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { AdminPlaceController } from '../admin-place.controller';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';

export const ApiAdminPlace: ApiOperator<keyof AdminPlaceController> = {
  SearchPlaces: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'Admin-SearchPlaces',
        BasicPlaceDto,
        { isArray: true },
      ),
    );
  },
  UpdatePlaceToiletInfo: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      StatusResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'Admin-UpdatePlaceToiletInfo',
      ),
    );
  },
};
