import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '@prisma/client';

export class NewUserOauthDto {
  @ApiProperty({
    description: '가입해야 하는 유저Email',
  })
  email: string;

  @ApiProperty({
    description: '가입해야 하는 유저 식별용 아이디',
  })
  providerUserId: string;

  @ApiProperty({
    enum: Provider,
    description: '가입  방식',
  })
  provider: string;
}
