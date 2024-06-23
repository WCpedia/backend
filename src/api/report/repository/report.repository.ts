import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
