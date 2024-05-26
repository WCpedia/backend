import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { ImageDto } from '@api/common/dto/image.dto';
import { UserSubmittedToiletInfoDto } from '@api/common/dto/user-submitted-toilet-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class FacilityReportDto extends UserSubmittedToiletInfoDto {
  @ApiProperty({
    type: Boolean,
    description: '운영자 확인 여부',
  })
  @Expose()
  isChecked: boolean;

  @ApiProperty({
    type: Date,
    description: '운영자 확인 일시',
  })
  @Expose()
  checkedAt: Date;

  @ApiProperty({
    type: ImageDto,
    description: '이미지 정보',
  })
  @Expose()
  @Type(() => ImageDto)
  images: ImageDto[];

  @ApiProperty({
    type: BasicPlaceDto,
    description: '가게 정보',
  })
  @Expose()
  @Type(() => BasicPlaceDto)
  place: BasicPlaceDto;

  @ApiProperty({
    type: BasicUserDto,
    description: '작성한 유저 정보',
  })
  @Expose()
  @Type(() => BasicUserDto)
  user: BasicUserDto;

  @ApiProperty({
    type: BasicUserDto,
    description: '운영자 정보',
  })
  @Expose()
  @Type(() => BasicUserDto)
  checker: BasicUserDto;
}
