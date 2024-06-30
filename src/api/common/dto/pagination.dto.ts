import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export default class PaginationDto {
  @ApiProperty({
    type: Number,
    description: '요청 개수',
  })
  @IsNumber()
  @IsNotEmpty()
  take: number;

  @ApiProperty({
    type: Number,
    description: '반환된 리뷰의 마지막 id',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  lastItemId: number;
}
