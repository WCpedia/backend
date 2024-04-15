import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TopReviewerDto extends BasicUserDto {
  @ApiProperty({
    type: Number,
    description: '리뷰 총 작성 횟수',
  })
  @Expose()
  totalReviewCount: number;

  @ApiProperty({
    type: Number,
    description: '리뷰 평균 평점',
  })
  @Expose()
  ratingAverage: number;

  @ApiProperty({
    type: Number,
    description: '주간 리뷰 작성 횟수',
  })
  @Expose()
  weeklyReviewCount: number;
}
