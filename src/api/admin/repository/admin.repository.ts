import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  IPaginationParams,
  IPlaceCategory,
} from '@src/interface/common.interface';
import { UpdateToiletInfoDto } from '../controllers/dtos/request/update-toilet-info.dto';
import { OrderByOption } from '@enums/order-by-option.enum';
import { Prisma, Region } from '@prisma/client';
import { ToiletInfoDto } from '@api/toilet/request/toilet-info.dto';

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async countFacilityReports({
    isChecked,
    convertedStartDate,
    convertedEndDate,
  }: {
    isChecked?: boolean;
    convertedStartDate?: Date;
    convertedEndDate?: Date;
  }): Promise<number> {
    return await this.prismaService.userSubmittedToiletInfo.count({
      where: {
        ...(isChecked !== undefined && { isChecked }),
        ...(convertedStartDate &&
          convertedEndDate && {
            createdAt: {
              gte: convertedStartDate,
              lt: convertedEndDate,
            },
          }),
      },
    });
  }

  async getFacilityReportList(
    paginationParams: IPaginationParams,
    isChecked: boolean,
  ) {
    return await this.prismaService.userSubmittedToiletInfo.findMany({
      where: {
        isChecked,
      },
      orderBy: {
        createdAt: OrderByOption.DESC,
      },
      include: {
        user: true,
        place: {
          include: {
            publicToiletInfo: true,
          },
        },
        images: true,
        checker: true,
      },
      ...paginationParams,
    });
  }

  async getFacilityReportById(reportId: number) {
    return await this.prismaService.userSubmittedToiletInfo.findUnique({
      where: {
        id: reportId,
      },
    });
  }

  async updateFacilityReportStatus(
    reportId: number,
    status: boolean,
    userId: number,
  ) {
    return await this.prismaService.userSubmittedToiletInfo.update({
      where: {
        id: reportId,
      },
      data: {
        isChecked: status,
        checkedBy: userId,
        checkedAt: new Date(),
      },
    });
  }

  async getPlaceWithAdminPlaceToiletRatingById(placeId: number) {
    return await this.prismaService.place.findUnique({
      where: { id: placeId },
      include: {
        adminPlaceToiletRating: true,
      },
    });
  }

  async countUsers({
    convertedStartDate,
    convertedEndDate,
  }: {
    convertedStartDate?: Date;
    convertedEndDate?: Date;
  }) {
    return await this.prismaService.user.count({
      where: {
        createdAt: {
          gte: convertedStartDate,
          lt: convertedEndDate,
        },
      },
    });
  }

  async countReports({
    convertedStartDate,
    convertedEndDate,
  }: {
    convertedStartDate?: Date;
    convertedEndDate?: Date;
  }) {
    return await this.prismaService.report.count({
      where: {
        createdAt: {
          gte: convertedStartDate,
          lt: convertedEndDate,
        },
      },
    });
  }

  async countFeedback({
    convertedStartDate,
    convertedEndDate,
  }: {
    convertedStartDate?: Date;
    convertedEndDate?: Date;
  }) {
    return await this.prismaService.userFeedback.count({
      where: {
        createdAt: {
          gte: convertedStartDate,
          lt: convertedEndDate,
        },
      },
    });
  }

  async upsertPlaceIncludeToiletInfo(
    data: Prisma.PlaceUncheckedCreateInput,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).place.upsert({
      where: { kakaoId: data.kakaoId },
      update: {},
      create: data,
      include: {
        region: true,
        placeCategory: {
          include: {
            depth1: true,
            depth2: true,
            depth3: true,
            depth4: true,
            depth5: true,
          },
        },
        toiletInfo: true,
      },
    });
  }

  async getRegion(
    region: Prisma.RegionAdministrativeDistrictDistrictCompoundUniqueInput,
    transaction?: Prisma.TransactionClient,
  ): Promise<Region> {
    return await (transaction ?? this.prismaService).region.findUnique({
      where: { administrativeDistrict_district: region },
    });
  }

  async upsertPlaceCategory(
    placeCategory: IPlaceCategory,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).placeCategory.upsert({
      where: {
        fullCategoryIds: placeCategory.fullCategoryIds,
      },
      update: {},
      create: placeCategory,
      select: { id: true },
    });
  }

  async upsertCategory(name: string, transaction?: Prisma.TransactionClient) {
    return await (transaction ?? this.prismaService).category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async createAdminPlaceToiletRating(
    placeRating: Prisma.AdminPlaceToiletRatingUncheckedCreateInput,
    transaction: Prisma.TransactionClient,
  ) {
    return await (
      transaction ?? this.prismaService
    ).adminPlaceToiletRating.create({
      data: placeRating,
    });
  }

  async createToiletInfo(
    placeId: number,
    { type, details }: ToiletInfoDto,
    transaction: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).toiletInfo.create({
      data: {
        placeId,
        type,
        details: {
          create: details,
        },
      },
    });
  }
}
