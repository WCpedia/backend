import { Exclude, Expose } from 'class-transformer';
import { ItemCountDto } from './daily-item-count.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

@Exclude()
export class FacilityReportCountDto extends OmitType(ItemCountDto, [
  'totalItemCount',
]) {
  @ApiProperty({
    type: Number,
    description: '확인 하지 않은 제보 수',
  })
  @Expose()
  uncheckedReportCount: number;
}
