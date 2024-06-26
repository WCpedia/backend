import { ToUpperCase } from '@api/common/decorators/to-upper-cate.decorator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ReportMainType,
  ReviewReportSubType,
  UserReportSubType,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: '신고할 유저의 id',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  targetUserId: number;

  @ApiProperty({
    enum: ReportMainType,
    description: '신고 메인 타입',
    required: false,
  })
  @IsEnum(ReportMainType)
  @ToUpperCase()
  @IsOptional()
  mainType: ReportMainType;

  @ApiProperty({
    enum: UserReportSubType,
    description: '유저 신고 서브 타입',
    required: false,
  })
  @IsEnum(UserReportSubType)
  @ToUpperCase()
  @IsOptional()
  userReportSubType: UserReportSubType;

  @ApiProperty({
    enum: ReviewReportSubType,
    description: '리뷰 신고 서브 타입',
    required: false,
  })
  @IsEnum(ReviewReportSubType)
  @ToUpperCase()
  @IsOptional()
  reviewSubType: ReviewReportSubType;

  @ApiProperty({
    description: '신고할 리뷰의 id',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  targetReviewId: number;

  @ApiProperty({
    description: '신고 내용',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}
