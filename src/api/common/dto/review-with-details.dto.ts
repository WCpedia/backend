import { BaseReturnDto } from '@api/common/dto/base-return.dto';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceReview, VisitTime } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReviewImageDto } from './review-image.dto';
import { ReviewReactionDto } from '@api/common/dto/reveiw-reaction.dto';
@Exclude()
export class ReviewWithDetailsDto extends BaseReturnDto implements PlaceReview {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  placeId: number;

  @ApiProperty({
    type: Number,
    description: '접근성',
  })
  @Expose()
  accessibilityRating: number;

  @ApiProperty({
    type: Number,
    description: '시설',
  })
  @Expose()
  facilityRating: number;

  @ApiProperty({
    type: Number,
    description: '청결',
  })
  @Expose()
  cleanlinessRating: number;

  @ApiProperty({
    enum: VisitTime,
    description: '방문 시간대',
  })
  @Expose()
  visitTime: VisitTime;

  @ApiProperty({
    type: String,
    description: '리뷰 내용',
  })
  @Expose()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'like 수',
  })
  @Expose()
  likeCount: number;

  @ApiProperty({
    type: Number,
    description: 'thumbsUp 수',
  })
  @Expose()
  thumbsUpCount: number;

  @ApiProperty({
    type: BasicUserDto,
    description: '작성자',
  })
  @Expose()
  @Type(() => BasicUserDto)
  user: BasicUserDto;

  @ApiProperty({
    type: ReviewImageDto,
    description: '리뷰 이미지',
  })
  @Expose()
  @Type(() => ReviewImageDto)
  images: ReviewImageDto[];

  @ApiProperty({
    description: '리뷰 반응',
    isArray: true,
  })
  @Expose()
  @Type(() => ReviewReactionDto)
  reviewReactions: ReviewReactionDto[];

  userId: number;
}
