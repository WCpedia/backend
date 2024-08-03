import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from '../services/report.service';
import { ApiReport } from './swagger/report.swagger';
import { CreateReportDto } from '../dtos/request/create-report.dto';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import PaginationDto from '@api/common/dto/pagination.dto';
import ReportDto from '../dtos/response/report.dto';
@ApiTags(DOMAIN_NAME.REPORT)
@Controller(DOMAIN_NAME.REPORT)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiReport.GetReportList({ summary: '신고 목록 조회' })
  @UseGuards(AccessTokenGuard)
  @Get()
  async getReportList(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Query() paginationDto: PaginationDto,
  ): Promise<ReportDto[]> {
    return this.reportService.getReportList(
      authorizedUser.userId,
      paginationDto,
    );
  }

  @ApiReport.CreateReport({ summary: '신고 생성' })
  @UseGuards(AccessTokenGuard)
  @Post()
  async createReport(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Body() createReportDto: CreateReportDto,
  ): Promise<void> {
    console.log(createReportDto);

    return this.reportService.createReport(
      authorizedUser.userId,
      createReportDto,
    );
  }

  @ApiReport.DeleteReport({ summary: '신고 삭제' })
  @UseGuards(AccessTokenGuard)
  @Delete(':reportId')
  async deleteReport(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('reportId', ParseIntPipe) reportId: number,
  ): Promise<void> {
    return this.reportService.deleteReport(authorizedUser.userId, reportId);
  }
}
