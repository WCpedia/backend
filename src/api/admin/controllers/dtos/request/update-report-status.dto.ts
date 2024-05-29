import { ToBoolean } from '@api/common/decorators/to-boolean.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateReportStatusDto {
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @ToBoolean()
  @IsNotEmpty()
  status: boolean;
}
