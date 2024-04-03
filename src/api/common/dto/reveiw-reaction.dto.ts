import { ApiProperty } from '@nestjs/swagger';
import { Emoji, ReviewReaction } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReviewReactionDto implements ReviewReaction {
  @ApiProperty({
    type: Number,
    description: 'ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    enum: Emoji,
  })
  @Expose()
  emoji: Emoji;

  reviewId: number;
  userId: number;
}
