import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '@prisma/client';

export class NewUserOauthDto {
  @ApiProperty({
    description: '가입해야 하는 유저Email',
  })
  email: string;

  @ApiProperty({
    enum: Provider,
    description: '가입  방식',
  })
  provider: string;
}
