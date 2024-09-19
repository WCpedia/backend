import { ToiletInfo, ToiletType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BaseReturnDto } from '@api/common/dto/base-return.dto';

@Exclude()
export class ToiletInfoDto extends BaseReturnDto implements ToiletInfo {
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
    type: String,
    description: '화장실 유형',
  })
  @Expose()
  type: ToiletType;
}
