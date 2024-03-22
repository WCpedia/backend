import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class CategoryDto implements Category {
  @ApiProperty({
    type: Number,
    description: '카테고리 식별ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '카테고리 명',
  })
  @Expose()
  name: string;
}
