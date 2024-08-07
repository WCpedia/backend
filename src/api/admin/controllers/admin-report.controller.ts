import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { SetRoles } from '@api/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from '@api/common/guards/role.guard';
import { AdminReportService } from '../services/admin-report.service';
import { ItemCountDto } from './dtos/response/daily-item-count.dto';
import { ApiAdminReport } from './swagger/admin-report.swagger';

@ApiTags(DOMAIN_NAME.ADMIN_REPORT)
@Controller(DOMAIN_NAME.ADMIN_REPORT)
@UseGuards(AccessTokenGuard, RoleGuard)
@SetRoles([Role.ADMIN])
export class AdminReportController {
  constructor(private readonly adminReportService: AdminReportService) {}

  @ApiAdminReport.GetReportCount({ summary: '신고 개수 조회' })
  @Get('/count')
  async getReportCount(): Promise<ItemCountDto> {
    return this.adminReportService.getReportCount();
  }
}
