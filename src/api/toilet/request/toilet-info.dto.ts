import { BaseReturnDto } from '@api/common/dto/base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  LocationType,
  LockType,
  ToiletDetail,
  ToiletType,
} from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ToiletDetailsDto } from './toilet-details.dto';

export class ToiletInfoDto {
  @ApiProperty({
    enum: ToiletType,
    description: '화장실 유형',
  })
  @IsNotEmpty()
  @IsEnum(ToiletType)
  type: ToiletType;

  @ApiProperty({
    type: ToiletDetailsDto,
    description: '화장실 상세 정보',
  })
  @IsNotEmpty()
  details: ToiletDetailsDto;
}
