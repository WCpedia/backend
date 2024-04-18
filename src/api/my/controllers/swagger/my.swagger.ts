import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiOperator } from '@src/types/type';
import { MyController } from '../my.controller';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { DetailUserProfileDto } from '@api/my/repository/response/DetailUserProfile.dts';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { PaginationResponseDto } from '@src/swagger-builder/pagination-response.dto';
import { ReviewWithDetailsDto } from '@api/common/dto/review-with-details.dto';
import { DetailReviewWithPlaceDto } from '@api/common/dto/helpful-review.dto';

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
        DetailReviewWithoutHelpfulDto,
      ),
    );
  },

  GetMyHelpfulReviews: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'helpfulReviews',
        DetailReviewWithPlaceDto,
      ),
    );
  },
};
