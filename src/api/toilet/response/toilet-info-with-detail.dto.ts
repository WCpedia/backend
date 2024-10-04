import { ApiProperty } from '@nestjs/swagger';
import { ToiletInfoDto } from './toilet-info.dto';
import { Expose, Type } from 'class-transformer';
import { ToiletDetailDto } from './toilet-detail.dto';

export class ToiletInfoWithDetailDto extends ToiletInfoDto {
  @ApiProperty({
    description: '화장실 상세 정보',
  })
  @Expose()
  @Type(() => ToiletDetailDto)
  detail: ToiletDetailDto;
}
