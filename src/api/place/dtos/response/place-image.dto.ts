import { ApiProperty } from '@nestjs/swagger';
import { PlaceImage, PlaceImageType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PlaceImageDto implements PlaceImage {
  @ApiProperty({
    type: Number,
    description: '이미지 ID',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '이미지 URL',
  })
  @Expose()
  url: string;

  type: PlaceImageType;
  placeId: number;
}
