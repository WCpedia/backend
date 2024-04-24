import { IsNicknameNotExist } from '@api/common/validators/nickname-not-exist.validator';
import { IsUsableNickname } from '@api/user/validators/nickname.validator';
import { ApiProperty } from '@nestjs/swagger';
import { extractS3Key } from '@src/utils/s3-url-transformer';
import { Transform } from 'class-transformer';
import { IsOptional, ValidateIf } from 'class-validator';

export class UpdateMyProfileDto {
  @ApiProperty({
    description: '닉네임',
    required: false,
  })
  @IsNicknameNotExist()
  @IsUsableNickname()
  @IsOptional()
  @ValidateIf(({ nickname }) => !!nickname)
  nickname: string;

  @ApiProperty({
    description: '유저 소개',
    required: false,
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: '프로필 이미지',
    required: false,
  })
  @Transform(({ value }) => extractS3Key(value))
  @IsOptional()
  @ValidateIf(({ profileImage }) => !!profileImage)
  profileImage: string;
}
