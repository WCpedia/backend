import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { ReviewWithDetailsDto } from '@api/common/dto/review-with-details.dto';
import { DetailUserProfileDto } from '@api/my/dtos/response/DetailUserProfile.dts';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ReviewDetailWithPlaceDto extends ReviewWithDetailsDto {
  @ApiProperty({
    type: BasicPlaceDto,
    description: '장소 정보',
  })
  @Type(() => BasicPlaceDto)
  @Expose()
  place: BasicPlaceDto;
}
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
