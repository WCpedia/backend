import { ApiProperty } from '@nestjs/swagger';
import { Category, PlaceCategory } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { CategoryDto } from './category.dto';

@Exclude()
export class PlaceCategoryWithDepthDto implements PlaceCategory {
  id: number;
  @ApiProperty({
    description: '카테고리 식별ID',
  })
  @Expose()
  fullCategoryIds: string;

  @ApiProperty({
    description: '카테고리의 마지막 Depth',
  })
  @Expose()
  lastDepth: number;

  @ApiProperty({
    description: '카테고리 Depth1 정보',
    type: CategoryDto,
  })
  @Expose()
  depth1: CategoryDto;

  @ApiProperty({
    description: '카테고리 Depth2 정보',
    type: CategoryDto,
  })
  @Expose()
  depth2: CategoryDto;

  @ApiProperty({
    description: '카테고리 Depth3 정보',
    type: CategoryDto,
  })
  @Expose()
  depth3: CategoryDto;

  @ApiProperty({
    description: '카테고리 Depth4 정보',
    type: CategoryDto,
  })
  @Expose()
  depth4: CategoryDto;

  @ApiProperty({
    description: '카테고리 Depth5 정보',
    type: CategoryDto,
  })
  @Expose()
  depth5: CategoryDto;

  depth1Id: number;
  depth2Id: number;
  depth3Id: number;
  depth4Id: number;
  depth5Id: number;
}
