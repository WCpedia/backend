import { IsNicknameNotExist } from '@api/common/validators/nickname-not-exist.validator';
import { IsUsableNickname } from '@api/user/validators/nickname.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class SignUpWithOAuthProviderDto {
  @ApiProperty({
    description: '가입해야 하는 유저Email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: Provider,
    description: '가입  방식',
  })
  @IsEnum(Provider)
  @IsNotEmpty()
  provider: Provider;

  @ApiProperty({
    description: '닉네임',
  })
  @IsNicknameNotExist()
  @IsUsableNickname()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '비밀번호',
    required: false,
  })
  @ValidateIf(({ provider }) => provider === Provider.LOCAL)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '유저 소개',
    required: false,
  })
  @IsOptional()
  description: string;
}
