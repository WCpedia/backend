import { PlaceCategoryWithDepthDto } from '@api/common/dto/place-category-with-depth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Place, Region } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PlaceSearchResultDto implements Place {
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

  @Expose()
  region: Region;

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
    type: PlaceCategoryWithDepthDto,
    description: '카테고리 정보',
  })
  @Type(() => PlaceCategoryWithDepthDto)
  @Expose()
  placeCategory: PlaceCategoryWithDepthDto;

  @ApiProperty({
    type: Number,
    description: '접근성 별점',
  })
  @Expose()
  accessibilityRating: number;

  @ApiProperty({
    type: Number,
    description: '리뷰 수',
  })
  @Expose()
  reviewCount: number;

  kakaoUrl: string;
  x: number;
  y: number;
  placeCategoryId: number;
  regionId: number;
  facilityRating: number;
  cleanlinessRating: number;
  facilityRatingCount: number;
  cleanlinessRatingCount: number;
  isInitial: boolean;
}
