import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { UploadFileLimit } from '@src/constants/consts/upload-file.const';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { CreatePlaceReviewDto } from '../dtos/request/create-place-review.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';

@ApiTags('place')
@Controller(DOMAIN_NAME.PLACE)
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiPlace.GetPlace({
    summary: '장소 조회',
  })
  @Get(':kakaoId')
  async getPlace(@Param('kakaoId') kakaoId: string): Promise<PlaceDetailDto> {
    return await this.placeService.getPlaceByKakaoId(kakaoId);
  }

  @ApiPlace.CreatePlaceReview({
    summary: '리뷰 생성',
  })
  @Post(':placeId/review')
  @UploadImages({
    maxCount: UploadFileLimit.REVIEW_IMAGES,
    path: 'place',
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
}
