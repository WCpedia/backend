import { ApiProperty } from '@nestjs/swagger';
import { UserSubmittedToiletInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { BaseReturnDto } from './base-return.dto';

@Exclude()
export class UserSubmittedToiletInfoDto
  extends BaseReturnDto
  implements UserSubmittedToiletInfo
{
  @ApiProperty({
    type: Number,
    description: 'id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
    description: '가게 id',
  })
  @Expose()
  placeId: number;

  @ApiProperty({
    type: Number,
    description: '작성한 유저 id',
  })
  @Expose()
  userId: number;

  @ApiProperty({
    type: Boolean,
    description: '남녀공용 여부',
  })
  @Expose()
  isUnisex: boolean;

  @ApiProperty({
    type: Boolean,
    description: '핸드 드라이어 유무',
  })
  @Expose()
  hasHandDryer: boolean;

  @ApiProperty({
    type: Boolean,
    description: '파우더룸 유무',
  })
  @Expose()
  hasPowderRoom: boolean;

  @ApiProperty({
    type: Boolean,
    description: '기저귀 교환대 유무',
  })
  @Expose()
  hasBabyChangingFacility: boolean;

  @ApiProperty({
    type: Boolean,
    description: '손 소독제 유무',
  })
  @Expose()
  hasSanitizer: boolean;

  @ApiProperty({
    type: Boolean,
    description: '실내 위치 여부',
  })
  @Expose()
  indoor: boolean;

  @ApiProperty({
    type: Boolean,
    description: '장애인 접근성 여부',
  })
  @Expose()
  accessible: boolean;

  @ApiProperty({
    type: Boolean,
    description: '여성 위생용품 수거함 유무',
  })
  @Expose()
  hasFeminineProductsBin: boolean;

  @ApiProperty({
    type: Boolean,
    description: '어린이 소변기 유무',
  })
  @Expose()
  hasChildUrinal: boolean;

  isChecked: boolean;
  checkedBy: number;
  checkedAt: Date;

  maleToiletCount: number;
  maleUrinalCount: number;
  femaleToiletCount: number;
}
