import { ApiProperty } from '@nestjs/swagger';
import { ReviewImage } from '@prisma/client';
import { transformS3Url } from '@src/utils/s3-url-transformer';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ReviewImageDto implements Pick<ReviewImage, 'id' | 'key'> {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '이미지 URL',
  })
  @Expose()
  @Transform(({ obj }) => transformS3Url({ value: obj.key }), {
    toClassOnly: true,
  })
  url: string;

  key: string;
}
