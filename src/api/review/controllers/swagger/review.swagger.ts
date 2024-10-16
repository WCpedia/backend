import { ApiOperator } from '@src/types/type';
import { ReviewController } from '../review.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { TopReviewersDto } from '@api/review/dtos/response/top-reviewers.dto';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { HelpfulReviewDto } from '@api/common/dto/reveiw-reaction.dto';
import { MultipartFormDataRequestDto } from '@src/swagger-builder/multipart-form-data-request.dto';
import { CreatePlaceReviewDto } from '@api/place/dtos/request/create-place-review.dto';
import { UpdatePlaceReviewDto } from '@api/review/dtos/request/update-place-review.dto';

export const ApiReview: ApiOperator<keyof ReviewController> = {
  GetLatestReviews: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetLatestReviews',
        DetailReviewWithoutHelpfulDto,
        { isArray: true },
      ),
    );
  },

  GetTopReviewers: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetTopReviewers',
        TopReviewersDto,
        { isArray: true },
      ),
    );
  },

  CreateHelpfulReview: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'CreateHelpfulReview',
        HelpfulReviewDto,
      ),
    );
  },

  UpdateReview: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      MultipartFormDataRequestDto.swaggerBuilder(
        'UpdateReview',
        'images',
        UpdatePlaceReviewDto,
        { required: false, isArray: true },
      ),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'UpdateReview'),
    );
  },

  DeleteReview: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'DeleteReview'),
    );
  },
};
