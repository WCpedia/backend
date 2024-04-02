import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { IKakaoSearchImageDocuments } from '@api/place/interface/interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPlaceByKakaoId(kakaoId: string) {
    return await this.prismaService.place.findFirst({
      where: { kakaoId },
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
        images: true,
      },
    });
  }

  async createPlaceImages(
    placeId: number,
    placeImages: IKakaoSearchImageDocuments[],
  ): Promise<Prisma.BatchPayload> {
    return await this.prismaService.placeImage.createMany({
      data: placeImages.map((placeImage) => ({
        placeId,
        url: placeImage.image_url,
      })),
    });
  }

  async getPlaceImages(placeId: number) {
    return await this.prismaService.placeImage.findMany({
      where: { placeId },
    });
  }
}
