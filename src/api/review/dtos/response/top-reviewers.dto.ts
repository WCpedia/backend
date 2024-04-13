import { ApiProperty } from '@nestjs/swagger';
import { transformS3Url } from '@src/utils/s3-url-transformer';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class TopReviewersDto {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    type: Number,
    description: '리뷰 작성 횟수',
  })
  @Expose()
  reviewCount: number;

  @ApiProperty({
    type: String,
    description: '유저 닉네임',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @Expose()
  @Transform(({ obj }) => transformS3Url({ value: obj.profileImageKey }), {
    toClassOnly: true,
  })
  url?: string;

  profileImageKey: string;
}
