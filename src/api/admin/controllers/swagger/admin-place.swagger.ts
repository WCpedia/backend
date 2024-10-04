import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { AdminPlaceController } from '../admin-place.controller';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { ExceptionResponseDto } from '@src/swagger-builder/exeption-response.dto';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import {
  AdminExceptionEnum,
  AdminExceptionMessage,
} from '@exceptions/http/enums/admin.exception.enum';

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

  CreatePlaceToiletInfo: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      StatusResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'Admin-CreatePlaceToiletInfo',
      ),
      ExceptionResponseDto.swaggerBuilder(HttpExceptionStatusCode.NOT_FOUND, [
        {
          errorCode: AdminExceptionEnum.NOT_FOUND_PLACE,
          description:
            AdminExceptionMessage[AdminExceptionEnum.NOT_FOUND_PLACE],
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpExceptionStatusCode.BAD_REQUEST, [
        {
          errorCode: AdminExceptionEnum.ALREADY_RATED_PLACE,
          description:
            AdminExceptionMessage[AdminExceptionEnum.ALREADY_RATED_PLACE],
        },
      ]),
    );
  },
};
