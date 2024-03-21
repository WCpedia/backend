import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  IRegionDepth,
  PrismaTransaction,
} from '@src/interface/common.interface';

@Injectable()
export class SearchRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findPlaceCategory(
    placeCategory: IRegionDepth,
    transaction?: PrismaTransaction,
  ) {
    return await (transaction ?? this.prismaService).placeCategory.findFirst({
      where: placeCategory,
    });
  }

  async createPlaceCategory(
    data: Prisma.PlaceCategoryCreateInput,
    transaction?: PrismaTransaction,
  ) {
    return await (transaction ?? this.prismaService).placeCategory.create({
      data,
    });
  }

  async upsertCategory(name: string, transaction?: PrismaTransaction) {
    return await (transaction ?? this.prismaService).category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async createPlace(
    data: Prisma.PlaceUncheckedCreateInput,
    transaction: PrismaTransaction,
  ) {
    return await (transaction ?? this.prismaService).place.upsert({
      where: { kakaoId: data.kakaoId },
      update: {},
      create: data,
    });
  }

  async upsertRegion(
    region: Prisma.RegionAdministrativeDistrictDistrictCompoundUniqueInput,
    transaction?: PrismaTransaction,
  ) {
    console.log(region);

    return await (transaction ?? this.prismaService).region.upsert({
      where: { administrativeDistrict_district: region },
      update: {},
      create: region,
    });
  }
}
