import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BaseReturnDto {
  @ApiProperty({
    type: Date,
    description: '생성일',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: '수정일',
  })
  @Expose()
  updatedAt: Date;
}
