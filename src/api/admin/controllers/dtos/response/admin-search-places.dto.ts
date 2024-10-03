import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ToiletInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AdminSearchPlacesDto extends BasicPlaceDto {
  @ApiProperty({
    description: '화장실 정보',
  })
  @Expose()
  toiletInfo: ToiletInfo[];
}
