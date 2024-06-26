import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { ApiReport } from './swagger/report.swagger';
import { CreateReportDto } from '../dtos/request/create-report.dto';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
@ApiTags(DOMAIN_NAME.REPORT)
@Controller(DOMAIN_NAME.REPORT)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiReport.CreateReport({ summary: '신고 생성' })
  @UseGuards(AccessTokenGuard)
  @Post()
  async createReport(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Body() createReportDto: CreateReportDto,
  ): Promise<void> {
    return this.reportService.createReport(
      authorizedUser.userId,
      createReportDto,
    );
  }
}
