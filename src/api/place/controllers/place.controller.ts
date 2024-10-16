import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ApiPlace } from '@api/place/controllers/swagger/place.swagger';
import { PlaceService } from '@api/place/services/place.service';
import { PlaceDetailDto } from '@api/place/dtos/response/place-detail.dto';
import { UploadImages } from '@src/utils/image-upload-interceptor';
import { ApiTags } from '@nestjs/swagger';
import {
  FilePath,
  UploadFileLimit,
} from '@src/constants/consts/upload-file.const';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { CreatePlaceReviewDto } from '@api/place/dtos/request/create-place-review.dto';
import { AllowGuestGuard } from '@api/common/guards/allow-guest.guard';
import { ReviewWithDetailsDto } from '@api/common/dto/review-with-details.dto';
import { MyPlaceReviewDto } from '@api/place/dtos/response/my-place-review.dto';
import { GetPlaceReviewDto } from '@api/place/dtos/request/get-place-review.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { ReportFacilityDto } from '@api/place/dtos/request/report-facility.dto';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { GetPlaceDto } from '@api/place/dtos/request/get-place.dto';
import { BasicPlaceWithToiletDto } from '@api/place/dtos/response/basic-place-with-toilet.dto';
import GetPlacesWithToiletDto from '@api/place/dtos/request/get-places-with-toilet.dto';

@ApiTags(DOMAIN_NAME.PLACE)
@Controller(DOMAIN_NAME.PLACE)
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiPlace.GetPlacesWithToilet({
    summary: '화장실 정보가 있는 가게 조회',
  })
  @Get('toilet')
  async getPlacesWithToilet(
    @Query() getPlacesWithToiletDto: GetPlacesWithToiletDto,
  ): Promise<PaginatedResponse<BasicPlaceWithToiletDto, 'places'>> {
    return await this.placeService.getPlacesWithToilet(getPlacesWithToiletDto);
  }

  @ApiPlace.GetPlace({
    summary: '가게 상세 조회',
  })
  @Get(':placeId')
  @UseGuards(AllowGuestGuard)
  async getPlace(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('placeId', ParseIntPipe) placeId: number,
    @Query() getPlaceDto: GetPlaceDto,
  ): Promise<PlaceDetailDto> {
    return await this.placeService.getPlaceByPlaceId(
      placeId,
      authorizedUser?.userId,
      getPlaceDto.blockedUserIds,
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
  ): Promise<PaginatedResponse<ReviewWithDetailsDto, 'reviews'>> {
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
