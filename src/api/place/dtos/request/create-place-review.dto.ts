import { ReviewLength } from '@api/common/constants/const';
import { ApiProperty } from '@nestjs/swagger';
import { VisitTime } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePlaceReviewDto {
  @ApiProperty({
    description: '접근성 별점',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(ReviewLength.RATING.MIN)
  @Max(ReviewLength.RATING.MAX)
  accessibilityRating: number;

  @ApiProperty({
    description: '시설 별점',
  })
  @IsOptional()
  @IsNumber()
  @Min(ReviewLength.RATING.MIN)
  @Max(ReviewLength.RATING.MAX)
  facilityRating: number;

  @ApiProperty({
    description: '청결도 별점',
  })
  @IsOptional()
  @IsNumber()
  @Min(ReviewLength.RATING.MIN)
  @Max(ReviewLength.RATING.MAX)
  cleanlinessRating: number;

  @ApiProperty({
    description: '방문 시간대',
    required: false,
    enum: VisitTime,
  })
  @IsOptional()
  @IsString()
  visitTime?: VisitTime;

  @ApiProperty({
    description: '설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
