import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class BaseReturnDto {
  @ApiProperty({
    type: Date,
    description: '생성일',
  })
  @Expose()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: '수정일',
  })
  @Expose()
  @IsOptional()
  updatedAt: Date;
}
