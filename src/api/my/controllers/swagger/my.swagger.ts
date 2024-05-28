import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiOperator } from '@src/types/type';
import { MyController } from '../my.controller';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { DetailUserProfileDto } from '@api/my/dtos/response/DetailUserProfile.dts';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { PaginationResponseDto } from '@src/swagger-builder/pagination-response.dto';
import { DetailReviewWithPlaceDto } from '@api/common/dto/helpful-review.dto';
import { MultipartFormDataRequestDto } from '@src/swagger-builder/multipart-form-data-request.dto';
import { UserWithProviderDto } from '@api/common/dto/user-with-provider.dto';

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
        UserWithProviderDto,
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
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'myReviews',
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

  UpdateMyProfile: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      MultipartFormDataRequestDto.swaggerBuilder(
        'UpdateMyProfile',
        'image',
        DetailUserProfileDto,
        { required: false },
      ),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'UpdateMyProfile',
        String,
      ),
    );
  },
};
