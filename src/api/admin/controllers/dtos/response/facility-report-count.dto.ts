import { Exclude, Expose } from 'class-transformer';
import { DailyItemCountDto } from './daily-item-count.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FacilityReportCountDto extends DailyItemCountDto {
  @ApiProperty({
    type: Number,
    description: '확인 하지 않은 제보 수',
  })
  @Expose()
  uncheckedReportCount: number;
}
