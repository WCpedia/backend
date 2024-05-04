import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { ReviewDetailWithPlaceDto } from '@api/common/dto/detail-review-with-place.dto';
import { ReviewWithDetailsDto } from '@api/common/dto/review-with-details.dto';
import { DetailUserProfileDto } from '@api/my/dtos/response/DetailUserProfile.dts';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserWithReviewsDto {
  @ApiProperty({
    type: DetailUserProfileDto,
    description: '유저 프로필',
  })
  @Type(() => DetailUserProfileDto)
  @Expose()
  userProfile: DetailUserProfileDto;

  @ApiProperty({
    type: [ReviewDetailWithPlaceDto],
    description: '유저가 작성한 리뷰 목록',
  })
  @Type(() => ReviewDetailWithPlaceDto)
  @Expose()
  reviews: ReviewDetailWithPlaceDto[];
}
