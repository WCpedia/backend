import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { ToiletInfoWithDetailDto } from '@api/toilet/response/toilet-info-with-detail.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ToiletDetail, ToiletInfo } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
@Exclude()
export class BasicPlaceWithToiletDto extends BasicPlaceDto {
  @ApiProperty({
    type: Number,
    description: 'x 좌표',
  })
  @Expose()
  x: number;

  @ApiProperty({
    type: Number,
    description: 'y 좌표',
  })
  @Expose()
  y: number;

  @ApiProperty({
    type: ToiletInfoWithDetailDto,
    description: '화장실 정보',
  })
  @Expose()
  @Type(() => ToiletInfoWithDetailDto)
  toiletInfo: ToiletInfoWithDetailDto;
}
