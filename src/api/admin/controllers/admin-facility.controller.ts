import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { AdminFacilityService } from '../services/admin-facility.service';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { SetRoles } from '@api/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from '@api/common/guards/role.guard';
import { ApiAdminFacility } from './swagger/admin-facility.swagger';
import { GetFacilityReportListDto } from './dtos/request/ge-report-list.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { FacilityReportDto } from './dtos/response/facility-report.dto';
import { FacilityReportCountDto } from './dtos/response/facility-report-count.dto';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { UpdateReportStatusDto } from './dtos/request/update-report-status.dto';

@ApiTags(DOMAIN_NAME.ADMIN_FACILITY)
@Controller(DOMAIN_NAME.ADMIN_FACILITY)
@UseGuards(AccessTokenGuard, RoleGuard)
@SetRoles([Role.ADMIN])
export class AdminFacilityController {
  constructor(private readonly adminFacilityService: AdminFacilityService) {}

  @ApiAdminFacility.GetDailyCount({ summary: '제보된 시설 정보 개수 조회' })
  @Get('/daily-count')
  async getDailyCount(): Promise<FacilityReportCountDto> {
    return this.adminFacilityService.getReportCount();
  }

  @ApiAdminFacility.GetReportList({ summary: '제보된 시설 정보 리스트 조회' })
  @Get('/report-list')
  async getReportList(
    @Query() paginationDto: GetFacilityReportListDto,
  ): Promise<PaginatedResponse<FacilityReportDto, 'reports'>> {
    return this.adminFacilityService.getReportList(paginationDto);
  }

  @ApiAdminFacility.UpdateReportStatus({ summary: '제보 Status 업데이트' })
  @Patch('/report-list/:reportId')
  async updateReportStatus(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('reportId') reportId: number,
    @Query() updateReportStatusDto: UpdateReportStatusDto,
  ): Promise<void> {
    return this.adminFacilityService.updateReportStatus(
      authorizedUser.userId,
      reportId,
      updateReportStatusDto.status,
    );
  }
}
