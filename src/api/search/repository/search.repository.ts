import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Region } from '@prisma/client';
import { IPlaceCategory } from '@src/interface/common.interface';

@Injectable()
export class SearchRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
    });
  }

  async createPlaceCategory(
    data: Prisma.PlaceCategoryCreateInput,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).placeCategory.create({
      data,
    });
  }

  async upsertCategory(name: string, transaction?: Prisma.TransactionClient) {
    return await (transaction ?? this.prismaService).category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async createPlace(
    data: Prisma.PlaceUncheckedCreateInput,
    transaction: Prisma.TransactionClient,
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
}
