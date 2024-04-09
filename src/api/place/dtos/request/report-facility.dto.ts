import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';

export class ReportFacilityDto {
  @ApiProperty({ type: Boolean, required: false, description: '남여공용 여부' })
  @IsOptional()
  @IsBoolean()
  isUnisex?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '실내 위치 여부',
  })
  @IsOptional()
  @IsBoolean()
  indoor?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '핸드 드라이어 유무',
  })
  @IsOptional()
  @IsBoolean()
  hasHandDryer?: boolean;

  @ApiProperty({ type: Boolean, required: false, description: '파우더룸 유무' })
  @IsOptional()
  @IsBoolean()
  hasPowderRoom?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '기저귀 교환대 유무',
  })
  @IsOptional()
  @IsBoolean()
  hasBabyChangingFacility?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '손 소독제 유무',
  })
  @IsOptional()
  @IsBoolean()
  hasSanitizer?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '장애인 접근성 여부',
  })
  @IsOptional()
  @IsBoolean()
  accessible?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '여성 위생용품 수거함 유무',
  })
  @IsOptional()
  @IsBoolean()
  hasFeminineProductsBin?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '어린이 소변기 유무',
  })
  @IsOptional()
  @IsBoolean()
  hasChildUrinal?: boolean;

  // @ApiProperty({ description: '남성용 좌변기 개수' })
  // @IsOptional()
  // @IsNumber()
  // maleToiletCount?: number;

  // @ApiProperty({ description: '남성용 소변기 개수' })
  // @IsOptional()
  // @IsNumber()
  // maleUrinalCount?: number;

  // @ApiProperty({ description: '여성용 좌변기 개수' })
  // @IsOptional()
  // @IsNumber()
  // femaleToiletCount?: number;
}
