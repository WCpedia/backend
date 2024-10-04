import { ToiletInfoDto } from '@api/toilet/request/toilet-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class UpdateToiletInfoDto {
  @ApiProperty({
    type: Boolean,
    required: false,
    description: '화장실에 진심인 곳',
  })
  @IsOptional()
  @IsBoolean()
  isGoat?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '데이트 추천',
  })
  @IsOptional()
  @IsBoolean()
  isDateSpot?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '친구들 약속 장소로 추천',
  })
  @IsOptional()
  @IsBoolean()
  isFriendlySpot?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: '단체일때 추천',
  })
  @IsOptional()
  @IsBoolean()
  isGroupSpot?: boolean;

  @ApiProperty({ type: Number, description: '청결도' })
  @IsNotEmpty()
  @IsNumber()
  cleanlinessRating: number;

  @ApiProperty({ type: Number, description: '인테리어' })
  @IsNotEmpty()
  @IsNumber()
  interiorRating: number;

  @ApiProperty({ type: Number, description: '냄새' })
  @IsNotEmpty()
  @IsNumber()
  odorRating: number;

  @ApiProperty({ type: [ToiletInfoDto], description: '화장실 상세 정보' })
  @IsNotEmpty()
  @IsArray()
  toilets: ToiletInfoDto[];
}
