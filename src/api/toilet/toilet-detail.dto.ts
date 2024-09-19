import { BaseReturnDto } from '@api/common/dto/base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LocationType, LockType, ToiletDetail } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ToiletDetailDto extends BaseReturnDto implements ToiletDetail {
  @ApiProperty({
    type: Number,
    description: 'id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
    description: 'id',
  })
  @Expose()
  toiletInfoId: number;

  @ApiProperty({
    type: Number,
    description: '좌변기 개수',
  })
  @Expose()
  toiletCount: number;

  @ApiProperty({
    type: Number,
    description: '소변기 개수',
  })
  @Expose()
  urinalCount: number;

  @ApiProperty({
    type: Boolean,
    description: '장애인 화장실 여부',
  })
  @Expose()
  isAccessibleToilet: boolean;

  @ApiProperty({
    type: Boolean,
    description: '손건조기 여부',
  })
  @Expose()
  hasHandDryer: boolean;

  @ApiProperty({
    type: Boolean,
    description: '기저귀 교환대 유무',
  })
  @Expose()
  hasBabyChangingFacility: boolean;

  @ApiProperty({
    type: Boolean,
    description: '세정제 여부',
  })
  @Expose()
  hasSanitizer: boolean;

  @ApiProperty({
    type: Boolean,
    description: '위생용품 수거함 유무',
  })
  @Expose()
  hasFeminineProductsBin: boolean;

  @ApiProperty({
    type: Boolean,
    description: '여성용 위생용품 구비 여부',
  })
  @Expose()
  hasFeminineProducts: boolean;

  @ApiProperty({
    type: Boolean,
    description: '유아용 변기 여부',
  })
  @Expose()
  hasChildToilet: boolean;

  @ApiProperty({
    type: Boolean,
    description: '유아용 의자 여부',
  })
  @Expose()
  hasBabyChair: boolean;

  @ApiProperty({
    type: Boolean,
    description: '긴급 벨 여부',
  })
  @Expose()
  hasEmergencyBell: boolean;

  @ApiProperty({
    type: Boolean,
    description: '지지대 여부',
  })
  @Expose()
  hasSupportBars: boolean;

  @ApiProperty({
    type: String,
    description: '화장실 잠금장치',
  })
  @Expose()
  lockType: LockType;

  @ApiProperty({
    type: String,
    description: '위치 유형',
  })
  @Expose()
  locationType: LocationType;

  @ApiProperty({
    type: String,
    description: '위치 상세 설명',
  })
  @Expose()
  locationDescription: string;

  @ApiProperty({
    type: Boolean,
    description: '파우더룸 유무',
  })
  @Expose()
  hasPowderRoom: boolean;

  @ApiProperty({
    type: Boolean,
    description: '실내 위치 여부',
  })
  accessible: boolean;
}
