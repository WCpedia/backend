import { ApiProperty } from '@nestjs/swagger';
import { Region } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegionDto implements Region {
  @ApiProperty({
    type: Number,
    description: '지역 정보',
  })
  @Expose()
  id: number;
  @ApiProperty({
    description: '시/도',
  })
  @Expose()
  administrativeDistrict: string;
  @ApiProperty({
    description: '시/군/구',
  })
  @Expose()
  district: string;
}
