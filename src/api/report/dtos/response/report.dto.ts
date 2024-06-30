import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  Report,
  ReportMainType,
  ReviewReportSubType,
  UserReportSubType,
} from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export default class ReportDto implements Report {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ description: '신고 대상', type: BasicUserDto })
  @Type(() => BasicUserDto)
  @Expose()
  targetUser: BasicUserDto;

  @ApiProperty({ description: '신고 유형', enum: ReportMainType })
  @Expose()
  mainType: ReportMainType;

  @ApiProperty({
    description: '유저 신고 유형',
    enum: UserReportSubType,
    nullable: true,
  })
  @Expose()
  userReportSubType: UserReportSubType;

  @ApiProperty({
    description: '리뷰 신고 유형',
    enum: ReviewReportSubType,
    nullable: true,
  })
  @Expose()
  reviewSubType: ReviewReportSubType;

  @ApiProperty({ description: '신고 내용', nullable: true })
  @Expose()
  description: string;

  @ApiProperty({ description: '작성일', type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '처리 여부', type: Boolean })
  @Expose()
  isResolved: boolean;

  targetUserId: number;
  targetReviewId: number;
  deletedAt: Date;
  reporterId: number;
}
