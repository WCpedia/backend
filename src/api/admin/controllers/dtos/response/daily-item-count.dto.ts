import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ItemCountDto {
  @ApiProperty({
    type: Number,
    description: '총 아이템 수',
  })
  @Expose()
  totalItemCount: number;

  @ApiProperty({
    type: Number,
    description: '오늘 등록된 아이템 수',
  })
  @Expose()
  todayItemCount: number;

  @ApiProperty({
    type: Number,
    description: '어제 등록된 아이템 수',
  })
  @Expose()
  yesterdayItemCount: number;
}
