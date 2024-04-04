import { ApiProperty } from '@nestjs/swagger';
import { MenuInfo } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MenuInfoDto implements MenuInfo {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  id: number;
  @ApiProperty({
    description: '메뉴명',
  })
  @Expose()
  menu: string;

  @ApiProperty({
    description: '가격',
    nullable: true,
  })
  @Expose()
  price: string;

  placeId: number;
}
