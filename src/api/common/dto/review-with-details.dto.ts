import { BaseReturnDto } from '@api/common/dto/base-return.dto';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceReview, VisitTime } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ImageDto } from './image.dto';
import { HelpfulReviewDto } from '@api/common/dto/reveiw-reaction.dto';
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
  })
  @Expose()
  helpfulCount: number;

  @ApiProperty({
    type: BasicUserDto,
    description: '작성자',
  })
  @Expose()
  @Type(() => BasicUserDto)
  user: BasicUserDto;

  @ApiProperty({
    type: ImageDto,
    description: '리뷰 이미지',
  })
  @Expose()
  @Type(() => ImageDto)
  images: ImageDto[];

  @ApiProperty({
    description: '리뷰 반응',
    isArray: true,
  })
  @Expose()
  @Type(() => HelpfulReviewDto)
  helpfulReviews: HelpfulReviewDto[];

  @ApiProperty({
    type: Number,
    description: '작성한 유저 Id',
  })
  @Expose()
  userId: number;
  deletedAt: Date;
}
