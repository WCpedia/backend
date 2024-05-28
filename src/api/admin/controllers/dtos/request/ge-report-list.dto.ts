import { PaginationDto } from '@api/common/dto/pagination.dto';
import { ToBoolean } from '@api/common/decorators/to-boolean.decorator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetFacilityReportListDto extends PaginationDto {
  @ApiProperty({
    description: '현재 페이지/첫 요청 시 0 or undefined',
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  currentPage: number;

  @ApiProperty({
    description: '이동할 페이지/첫 요청 시 0  or undefined',
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  targetPage: number;

  @ApiProperty({
    description: '반환된 내역의 첫번째 id/첫 요청 시 0  or undefined',
    type: Number,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  firstItemId: number;

  @ApiProperty({
    type: Boolean,
    description: '운영자 확인 여부',
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  isChecked: boolean;
}
