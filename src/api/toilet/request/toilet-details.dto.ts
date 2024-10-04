import { ApiProperty } from '@nestjs/swagger';
import { LockType, LocationType } from '@prisma/client';
import { IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class ToiletDetailsDto {
  @ApiProperty({
    type: Number,
    description: '좌변기 개수',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  toiletCount?: number;

  @ApiProperty({
    type: Number,
    description: '소변기 개수',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  urinalCount?: number;

  @ApiProperty({
    type: Boolean,
    description: '장애인 화장실 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAccessibleToilet?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '핸드 드라이어 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasHandDryer?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '파우더룸 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasPowderRoom?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '기저귀 교환대 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasBabyChangingFacility?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '손 세정제 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasSanitizer?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '장애인 접근성 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  accessible?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '여성 위생용품 수거함 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasFeminineProductsBin?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '여성 위생용품 구비 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasFeminineProducts?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '어린이 변기 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasChildToilet?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '영유아보호의자 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasBabyChair?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '비상벨 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasEmergencyBell?: boolean;

  @ApiProperty({
    type: Boolean,
    description: '지지대 유무',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasSupportBars?: boolean;

  @ApiProperty({
    enum: LockType,
    description: '잠금장치 유형',
    required: false,
  })
  @IsOptional()
  @IsEnum(LockType)
  lockType?: LockType;

  @ApiProperty({
    enum: LocationType,
    description: '위치 유형',
    required: false,
  })
  @IsOptional()
  @IsEnum(LocationType)
  locationType?: LocationType;

  @ApiProperty({
    type: String,
    description: '위치 부가 설명',
    required: false,
  })
  @IsOptional()
  locationDescription?: string;
}
