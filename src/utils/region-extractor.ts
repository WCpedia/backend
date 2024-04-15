import { CustomException } from '@exceptions/http/custom.exception';
import { MulterExceptionEnum } from '@exceptions/http/enums/global.exception.enum';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
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
    throw new CustomException(
      HttpExceptionStatusCode.BAD_REQUEST,
      MulterExceptionEnum.INVALID_ADDRESS_FORMAT,
    );
  }
}
