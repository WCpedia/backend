import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { SetRoles } from '@api/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from '@api/common/guards/role.guard';
import { ItemCountDto } from './dtos/response/daily-item-count.dto';
import { ApiAdminFeedback } from './swagger/admin-feedback.swagger';
import { AdminFeedbackService } from '../services/admin-feedback.service';

@ApiTags(DOMAIN_NAME.ADMIN_FEEDBACK)
@Controller(DOMAIN_NAME.ADMIN_FEEDBACK)
@UseGuards(AccessTokenGuard, RoleGuard)
@SetRoles([Role.ADMIN])
export class AdminFeedbackController {
  constructor(private readonly adminFeedbackService: AdminFeedbackService) {}

  @ApiAdminFeedback.GetFeedbackCount({ summary: '피드백 개수 조회' })
  @Get('/count')
  async getFeedbackCount(): Promise<ItemCountDto> {
    return this.adminFeedbackService.getFeedbackCount();
  }
}
