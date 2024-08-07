import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { SetRoles } from '@api/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from '@api/common/guards/role.guard';
import { AdminUserService } from '../services/admin-user.service';
import { ItemCountDto } from './dtos/response/daily-item-count.dto';
import { ApiAdminUser } from './swagger/admin-user.swagger';

@ApiTags(DOMAIN_NAME.ADMIN_USER)
@Controller(DOMAIN_NAME.ADMIN_USER)
@UseGuards(AccessTokenGuard, RoleGuard)
@SetRoles([Role.ADMIN])
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @ApiAdminUser.GetUserCount({ summary: '가입한 유저 정보 개수 조회' })
  @Get('/count')
  async getUserCount(): Promise<ItemCountDto> {
    return this.adminUserService.getUserCount();
  }
}
