import { DOMAIN_NAME } from '@enums/domain-name.enum';
import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { NicknameValidator } from '../validators/nickname.validator';
import { ApiUser } from './swagger/user.swagger';

@Controller(DOMAIN_NAME.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiUser.CheckNicknameUsable({ summary: '닉네임 사용 가능여부 확인' })
  @Get('/check-nickname')
  async checkNicknameUsable(
    @Query('nickname', NicknameValidator) nickname: string,
  ) {
    return this.userService.checkNicknameUsable(nickname);
  }
}
