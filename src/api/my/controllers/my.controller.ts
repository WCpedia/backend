import { DOMAIN_NAME } from '@enums/domain-name.enum';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MyService } from '../services/my.service';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiMy } from './swagger/user.swagger';

@ApiTags('my')
@Controller(DOMAIN_NAME.MY)
@UseGuards(AccessTokenGuard)
export class MyController {
  constructor(private readonly myService: MyService) {}

  @ApiMy.GetMyBasicProfile({ summary: '내 프로필 조회' })
  @Get('/basic-profile')
  async getMyBasicProfile(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
  ): Promise<BasicUserDto> {
    return this.myService.getMyBasicProfile(authorizedUser.userId);
  }

  @ApiMy.GetMyProfile({ summary: '내 프로필 상세 조회' })
  @Get('/profile')
  async getMyProfile(@GetAuthorizedUser() authorizedUser: IAuthorizedUser) {
    return this.myService.getMyProfile(authorizedUser.userId);
  }
}
