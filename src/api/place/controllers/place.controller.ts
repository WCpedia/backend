import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ApiPlace } from '@api/place/controllers/swagger/place.swagger';
import { PlaceService } from '@api/place/services/place.service';
import { PlaceDetailDto } from '@api/place/dtos/response/place-detail.dto';
import { UploadImages } from '@src/utils/image-upload-interceptor';
import { ApiTags } from '@nestjs/swagger';
import { DOMAIN_NAME } from '@src/constants/enums/domain-name.enum';
import {
  FilePath,
  UploadFileLimit,
} from '@src/constants/consts/upload-file.const';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { CreatePlaceReviewDto } from '../dtos/request/create-place-review.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { AllowGuestGuard } from '@api/common/guards/allow-guest.guard';
import { PlaceReviewWithDetailsDto } from '../dtos/response/place-review.dto';
import { MyPlaceReviewDto } from '../dtos/response/my-place-review.dto';
import { GetPlaceReviewDto } from '../dtos/request/get-place-review.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { ReportFacilityDto } from '../dtos/request/report-facility.dto';

@ApiTags('place')
@Controller(DOMAIN_NAME.PLACE)
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiPlace.GetPlace({
    summary: '가게 조회',
  })
  @Get(':placeId')
  @UseGuards(AccessTokenGuard)
  async getPlace(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('placeId', ParseIntPipe) placeId: number,
  ): Promise<PlaceDetailDto> {
    return await this.placeService.getPlaceByPlaceId(
      placeId,
      authorizedUser.userId,
    );
  }

  @ApiPlace.CreatePlaceReview({
    summary: '리뷰 생성',
  })
  @Post(':placeId/review')
  @UploadImages({
    maxCount: UploadFileLimit.REVIEW_IMAGES,
    path: FilePath.REVIEW,
  })
  @UseGuards(AccessTokenGuard)
  async createPlaceReview(
    @Param('placeId', ParseIntPipe) placeId: number,
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @UploadedFiles() reviewImages: Express.MulterS3.File[],
    @Body() createPlaceReviewDto: CreatePlaceReviewDto,
  ): Promise<void> {
    await this.placeService.createPlaceReview(
      placeId,
      authorizedUser.userId,
      createPlaceReviewDto,
      reviewImages,
    );
  }

  @ApiPlace.GetPlaceReviews({
    summary: '가게 리뷰 조회',
  })
  @UseGuards(AllowGuestGuard)
  @Get(':placeId/reviews')
  async getPlaceReviews(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('placeId', ParseIntPipe) placeId: number,
    @Query() getPlaceReviewDto: GetPlaceReviewDto,
  ): Promise<PaginatedResponse<PlaceReviewWithDetailsDto, 'reviews'>> {
    return await this.placeService.getPlaceReviewsByPlaceId(
      placeId,
      getPlaceReviewDto,
      authorizedUser?.userId,
    );
  }

  @ApiPlace.GetMyPlaceReview({
    summary: '내가 작성한 가게 리뷰 조회',
  })
  @UseGuards(AccessTokenGuard)
  @Get(':placeId/my-review')
  async getMyPlaceReview(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('placeId', ParseIntPipe) placeId: number,
  ): Promise<MyPlaceReviewDto> {
    return await this.placeService.getMyPlaceReview(
      placeId,
      authorizedUser.userId,
    );
  }

  @ApiPlace.ReportFacility({ summary: '시설 제보' })
  @Post(':placeId/facility-report')
  @UseGuards(AccessTokenGuard)
  @UploadImages({
    maxCount: UploadFileLimit.REPORT_FACILITY_IMAGES,
    path: FilePath.REVIEW,
  })
  async reportFacility(
    @Param('placeId', ParseIntPipe) placeId: number,
    @UploadedFiles() reportImages: Express.MulterS3.File[],
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Body() reportFacilityDto: ReportFacilityDto,
  ): Promise<void> {
    await this.placeService.reportFacility(
      placeId,
      authorizedUser.userId,
      reportFacilityDto,
      reportImages,
    );
  }
}
