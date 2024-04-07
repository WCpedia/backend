import { PlaceCategoryWithDepthDto } from '@api/common/dto/place-category-with-depth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Place, Region } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { PlaceImageDto } from './place-image.dto';
import { RegionDto } from '@api/common/dto/region.dto';
import { MenuInfoDto } from './menu-info.dto';
import { PlaceReviewWithDetailsDto } from './place-review.dto';

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
    description: '가게 이미지',
  })
  @Type(() => PlaceImageDto)
  @Expose()
  images: PlaceImageDto[];

  @ApiProperty({
    type: RegionDto,
    description: '지역 정보',
  })
  @Type(() => RegionDto)
  @Expose()
  region: Region;

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
    description: '시설 별점',
  })
  @Expose()
  facilityRating: number;

  @ApiProperty({
    type: Number,
    description: '청결도 별점',
  })
  @Expose()
  cleanlinessRating: number;

  @ApiProperty({
    type: Number,
    description: '별점 수',
  })
  @Expose()
  reviewCount: number;

  @ApiProperty({
    type: [MenuInfoDto],
    description: '메뉴 정보',
  })
  @Type(() => MenuInfoDto)
  @Expose()
  menuInfo: MenuInfoDto[];

  @ApiProperty({
    type: Number,
    description: '리뷰 총 개수',
  })
  @Expose()
  totalReviewCount: number;

  @ApiProperty({
    type: PlaceReviewWithDetailsDto,
    description: '내가 작성한 리뷰',
  })
  @Type(() => PlaceReviewWithDetailsDto)
  @Expose()
  myReview: PlaceReviewWithDetailsDto;

  @ApiProperty({
    type: [PlaceReviewWithDetailsDto],
    description: '리뷰 목록',
  })
  @Type(() => PlaceReviewWithDetailsDto)
  @Expose()
  reviews: PlaceReviewWithDetailsDto[];

  isInitial: boolean;
  placeCategoryId: number;
  regionId: number;
}
