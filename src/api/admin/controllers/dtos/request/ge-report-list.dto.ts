import { PaginationDto } from '@api/common/dto/pagination.dto';
import { ToBoolean } from '@api/common/decorators/to-boolean.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsBooleanString, IsOptional } from 'class-validator';

export class GetFacilityReportListDto extends PaginationDto {
  @ApiProperty({
    type: Boolean,
    description: '운영자 확인 여부',
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  isChecked: boolean;
}
