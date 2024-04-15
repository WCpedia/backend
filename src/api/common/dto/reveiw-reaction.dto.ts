import { ApiProperty } from '@nestjs/swagger';
import { HelpfulReview } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class HelpfulReviewDto implements HelpfulReview {
  @ApiProperty({
    type: Number,
    description: 'ID',
  })
  @Expose()
  id: number;

  reviewId: number;
  userId: number;
}
