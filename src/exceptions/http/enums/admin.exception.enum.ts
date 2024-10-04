export enum AdminExceptionEnum {
  NOT_FOUND_REPORT = 'NotFoundReport',
  NOT_FOUND_PLACE = 'NotFoundPlace',
  ALREADY_RATED_PLACE = 'AlreadyRatedPlace',
}

export const AdminExceptionMessage = {
  [AdminExceptionEnum.NOT_FOUND_REPORT]: '신고를 찾을 수 없습니다.',
  [AdminExceptionEnum.NOT_FOUND_PLACE]: '장소를 찾을 수 없습니다.',
  [AdminExceptionEnum.ALREADY_RATED_PLACE]: '이미 평점이 등록된 장소입니다.',
};
