import { PlaceCategoryWithDepthDto } from '@api/common/dto/place-category-with-depth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Place, Region } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { PlaceImageDto } from './place-image.dto';

@Exclude()
export class PlaceDetailDto implements Place {
  @ApiProperty({
    type: Number,
    description: '장소ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '카카오 PLACE ID',
  })
  @Expose()
  kakaoId: string;

  @ApiProperty({
    description: '장소명',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: '상세주소',
  })
  @Expose()
  detailAddress: string;

  @ApiProperty({
    description: '전화번호',
  })
  @Expose()
  telephone: string;

  @ApiProperty({
    description: '별점',
  })
  @Expose()
  stars: string;

  @ApiProperty({
    description: '카카오 URL',
  })
  @Expose()
  kakaoUrl: string;

  @ApiProperty({
    description: 'X 좌표',
  })
  @Expose()
  x: number;

  @ApiProperty({
    description: 'Y 좌표',
  })
  @Expose()
  y: number;

  @ApiProperty({
    type: [PlaceImageDto],
    description: '대표 이미지',
  })
  @Type(() => PlaceImageDto)
  @Expose()
  placeImage: PlaceImageDto[];

  @ApiProperty({
    description: '지역 정보',
  })
  @Expose()
  region: Region;

  @ApiProperty({
    type: PlaceCategoryWithDepthDto,
    description: '카테고리 정보',
  })
  @Type(() => PlaceCategoryWithDepthDto)
  @Expose()
  placeCategory: PlaceCategoryWithDepthDto;

  placeCategoryId: number;
  regionId: number;
}
