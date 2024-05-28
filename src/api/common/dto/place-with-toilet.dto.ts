import { PublicToiletInfoDto } from '@api/place/dtos/response/public-toilet-info.dto';
import { BasicPlaceDto } from './basic-place.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
@Exclude()
export class PlaceWithToiletDto extends BasicPlaceDto {
  @ApiProperty({
    type: PublicToiletInfoDto,
    description: '화장실 시설 정보',
  })
  @Expose()
  @Type(() => PublicToiletInfoDto)
  publicToiletInfo: PublicToiletInfoDto;
}
