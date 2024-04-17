import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiOperator } from '@src/types/type';
import { MyController } from '../my.controller';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { DetailUserProfileDto } from '@api/my/repository/response/DetailUserProfile.dts';
import { ReviewWithPlaceDto } from '@api/review/dtos/response/review-with-place.dto';

export const ApiMy: ApiOperator<keyof MyController> = {
  GetMyBasicProfile: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetMyBasicProfile',
        BasicUserDto,
      ),
    );
  },

  GetMyProfile: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetMyProfile',
        DetailUserProfileDto,
      ),
    );
  },

  GetMyReviews: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetMyReviews',
        ReviewWithPlaceDto,
      ),
    );
  },
};
