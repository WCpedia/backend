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
    description: '전반적 만족도 별점',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  overallRating: number;

  @ApiProperty({
    description: '향기 별점',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  scentRating?: number;

  @ApiProperty({
    description: '청결도 별점',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  cleanlinessRating?: number;

  @ApiProperty({
    description: '방문 시간대',
    required: false,
    enum: VisitTime,
  })
  @IsOptional()
  @IsString()
  visitTime?: string;

  @ApiProperty({
    description: '설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
