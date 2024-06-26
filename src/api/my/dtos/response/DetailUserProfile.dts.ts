import { BaseReturnDto } from '@api/common/dto/base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { transformS3Url } from '@src/utils/s3-url-transformer';
import { Exclude, Expose, Transform } from 'class-transformer';
@Exclude()
export class DetailUserProfileDto extends BaseReturnDto implements User {
  @ApiProperty({
    type: Number,
  })
  @Expose()
  id: number;
  @ApiProperty({
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
  url: string;

  @ApiProperty({
    description: '소개',
  })
  @Expose()
  description: string;

  @ApiProperty({
    type: Number,
    description: '작성한 리뷰 수',
  })
  @Expose()
  totalReviewCount: number;

  @ApiProperty({
    type: Number,
    description: '평균 평점',
  })
  @Expose()
  ratingAverage: number;

  @ApiProperty({
    type: Number,
    description: '도움이 된 리뷰 수',
  })
  @Expose()
  helpfulReviewCount: number;

  deletedAt: Date;
  role: Role;
  profileImageKey: string;
  isBanned: boolean;
}
