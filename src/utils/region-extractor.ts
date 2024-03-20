import { BadRequestException } from '@nestjs/common';
import { IExtractedRegion } from '@src/interface/common.interface';

export function extractRegion(address: string): IExtractedRegion {
  const addressParts = address.split(' ');
  let administrativeDistrict = null;
  let district = null;

  administrativeDistrict = addressParts.shift();

  if (administrativeDistrict === '세종특별자치시') {
    return {
      administrativeDistrict,
      district: null,
      detailAddress: addressParts.join(' '),
    };
  }

  district = addressParts.shift();
  if (
    district.endsWith('시') ||
    district.endsWith('군') ||
    district.endsWith('구')
  ) {
    return {
      administrativeDistrict,
      district,
      detailAddress: addressParts.join(' '),
    };
  } else {
    throw new BadRequestException(
      '잘못된 주소형식입니다',
      'InvalidAddressFormat',
    );
  }
}
