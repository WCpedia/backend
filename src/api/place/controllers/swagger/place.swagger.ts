import { ApiOperator } from '@src/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { PlaceController } from '@api/place/controllers/place.controller';
import { PlaceDetailDto } from '@api/place/dtos/response/place-detail.dto';
import { MultipartFormDataRequestDto } from '@src/swagger-builder/multipart-form-data-request.dto';
import { CreatePlaceReviewDto } from '@api/place/dtos/request/create-place-review.dto';
import { ExceptionResponseDto } from '@src/swagger-builder/exeption-response.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { PlaceReviewWithDetailsDto } from '@api/place/dtos/response/place-review.dto';
import { MyPlaceReviewDto } from '@api/place/dtos/response/my-place-review.dto';
import { PaginationResponseDto } from '@src/swagger-builder/pagination-response.dto';

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

  CreatePlaceReview: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      MultipartFormDataRequestDto.swaggerBuilder(
        'CreatePlaceReview',
        'images',
        CreatePlaceReviewDto,
        { required: false, isArray: true },
      ),
      StatusResponseDto.swaggerBuilder(HttpStatus.CREATED, 'CreatePlaceReview'),
    );
  },

  GetPlaceReviews: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'reviews',
        PlaceReviewWithDetailsDto,
      ),
    );
  },

  GetMyPlaceReview: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetMyPlaceReview',
        MyPlaceReviewDto,
      ),
    );
  },
};
