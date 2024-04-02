import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlaceRepository } from '@api/place/repository/place.repository';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { ProductConfigService } from '@core/config/services/config.service';
import { plainToInstance } from 'class-transformer';
import { PlaceDetailDto } from '@api/place/dtos/response/place-detail.dto';
import { OAUTH_KEY } from '@core/config/constants/config.constant';
import axios, { AxiosResponse } from 'axios';
import { Place, PlaceImage, Region } from '@prisma/client';
import {
  IKakaoSearchImageDocuments,
  IKakaoSearchImageResponse,
} from '@api/place/interface/interface';

@Injectable()
export class PlaceService {
  private kakaoSearchImageUri: string;
  private kakaoAuthKey: string;
  private kakaoSearchImageMaxSize: number;

  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly configService: ProductConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.kakaoSearchImageUri = this.configService.get<string>(
      OAUTH_KEY.KAKAO_SEARCH_IMAGE_URI,
    );
    this.kakaoAuthKey = this.configService.get<string>(
      OAUTH_KEY.KAKAO_AUTHORIZATION_KEY,
    );
    this.kakaoSearchImageMaxSize = this.configService.get<number>(
      OAUTH_KEY.KAKAO_SEARCH_IMAGE_MAX_SIZE,
    );
  }

  async getPlaceByKakaoId(kakaoId: string): Promise<PlaceDetailDto> {
    const selectedPlace = await this.placeRepository.getPlaceByKakaoId(kakaoId);
    if (!selectedPlace) {
      return;
    }

    await this.ensurePlaceImages(selectedPlace);

    return plainToInstance(PlaceDetailDto, selectedPlace);
  }

  private async ensurePlaceImages(
    place: Place & { region: Region; images: PlaceImage[] },
  ) {
    if (place.images[0]) {
      return;
    }

    const placeImages = await this.fetchKakaoSearchImages(place);
    if (!placeImages[0]) {
      return;
    }

    await this.placeRepository.createPlaceImages(place.id, placeImages);
    place.images = await this.placeRepository.getPlaceImages(place.id);
  }

  private async fetchKakaoSearchImages(
    place: Place & { region: Region },
  ): Promise<IKakaoSearchImageDocuments[]> {
    try {
      const queries = [
        `${place.detailAddress} ${place.name}`,
        `${place.region.administrativeDistrict} ${place.region.district} ${place.name}`,
        place.name,
      ];

      for (const query of queries) {
        const response: AxiosResponse<IKakaoSearchImageResponse> =
          await axios.get(this.kakaoSearchImageUri, {
            headers: {
              Authorization: this.kakaoAuthKey,
              'Content-type': 'application/x-www-form-urlencoded',
            },
            params: { query, size: this.kakaoSearchImageMaxSize },
          });

        if (response.data.documents[0]) {
          return response.data.documents;
        }
      }
      return [];
    } catch (error) {
      throw new InternalServerErrorException(
        `Kakao API 호출에 실패했습니다: ${error}`,
      );
    }
  }
}
