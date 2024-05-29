import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { UpdateToiletInfoDto } from '../controllers/dtos/request/update-toilet-info.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { AdminExceptionEnum } from '@exceptions/http/enums/admin.exception.enum';

@Injectable()
export class AdminPlaceService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async updatePlaceToiletInfo(
    placeId: number,
    dto: UpdateToiletInfoDto,
  ): Promise<void> {
    const selectedPlace = await this.adminRepository.getPlaceById(placeId);
    if (!selectedPlace) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        AdminExceptionEnum.NOT_FOUND_PLACE,
      );
    }

    await this.adminRepository.updatePlaceToiletInfo(placeId, dto);
  }
}
