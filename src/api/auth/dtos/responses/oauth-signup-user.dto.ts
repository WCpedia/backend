import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '@prisma/client';

export class OauthSignupUserDto {
  @ApiProperty({
    description: '가입해야 하는 유저Email',
  })
  userEmail: string;

  @ApiProperty({
    enum: Provider,
    description: '가입  방식',
  })
  provider: string;
}
