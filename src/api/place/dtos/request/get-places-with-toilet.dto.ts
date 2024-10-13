import PaginationDto from '@api/common/dto/pagination.dto';
import {
  LocationType,
  RecommendationType,
} from '@api/common/constants/enum/enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { AreaName } from '@api/common/constants/const/area.const';

export default class GetPlacesWithToiletDto extends PaginationDto {
  @ApiProperty({
    enum: LocationType,
    description: '검색할 가게의 지역 타입',
    required: false,
  })
  @IsOptional()
  @IsEnum(LocationType)
  locationType: LocationType = LocationType.NONE;

  @ApiProperty({
    description: '시/도 district와 함께 입력되어야 합니다.',
    required: false,
  })
  @IsNotEmpty()
  @ValidateIf((o) => o.regionType === LocationType.REGION)
  administrativeDistrict: string;

  @ApiProperty({
    description: '시/군/구 administrativeDistrict와 함께 입력되어야 합니다.',
    required: false,
  })
  @IsNotEmpty()
  @ValidateIf((o) => o.regionType === LocationType.REGION)
  district: string;

  @ApiProperty({
    enum: AreaName,
    description: '임의 지역',
    required: false,
  })
  @IsNotEmpty()
  @ValidateIf((o) => o.regionType === LocationType.AREA)
  area: (typeof AreaName)[keyof typeof AreaName];

  @ApiProperty({
    enum: RecommendationType,
    description: '추천 유형',
    required: false,
  })
  @IsOptional()
  @IsEnum(RecommendationType)
  recommendationType: RecommendationType;
}
