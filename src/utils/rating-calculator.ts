import { RatingTypes } from '@api/place/constants/const/const';
import { ICalculatedRating } from '@api/place/interface/interface';
import { CalculateOperation } from '@enums/calculate-operation.enum';
import {
  IPlaceRatingInfo,
  IRatingTypes,
  IUserRatingInfo,
} from '@src/interface/common.interface';

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation.CREATE,
  newRatings: IRatingTypes,
): ICalculatedRating;

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation.DELETE,
  newRatings: undefined,
  oldRatings: IRatingTypes,
): ICalculatedRating;

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation.UPDATE,
  newRatings: IRatingTypes,
  oldRatings: IRatingTypes,
): ICalculatedRating;

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation,
  newRatings?: IRatingTypes, // 새 리뷰 평점, 생성 또는 업데이트 시 사용
  oldRatings?: IRatingTypes, // 이전 리뷰 평점, 삭제 또는 업데이트 시 사용
): ICalculatedRating {
  let placeReviewCount = place.reviewCount;
  let userReviewCount = userRating.totalReviewCount;

  if (operation === CalculateOperation.CREATE) {
    userReviewCount += 1;
    placeReviewCount += 1;
  } else if (operation === CalculateOperation.DELETE) {
    userReviewCount -= 1;
    placeReviewCount -= 1;
  }

  let totalNewRating = 0;
  let totalOldRating = 0;

  const updateData = RatingTypes.reduce((acc, ratingType) => {
    const oldRating = oldRatings ? oldRatings[ratingType] : 0;
    const newRating = newRatings ? newRatings[ratingType] : 0;

    if (operation !== CalculateOperation.DELETE) {
      totalNewRating += newRating;
    }
    totalOldRating += oldRating;

    if (placeReviewCount === 0) {
      acc[ratingType] = null; // 리뷰 수가 0일 때는 평점을 null로 설정
    } else {
      const currentRating = place[ratingType];
      let updatedRating =
        operation === CalculateOperation.DELETE
          ? (currentRating * place.reviewCount - oldRating) / placeReviewCount
          : (currentRating * place.reviewCount - oldRating + newRating) /
            placeReviewCount;

      acc[ratingType] = Math.round(updatedRating * 10000) / 10000;
    }

    return acc;
  }, {} as ICalculatedRating);

  if (userReviewCount === 0) {
    updateData.userRatingAverage = 0;
  } else {
    // 모든 평가 항목에 대한 계산이 완료된 후 유저  평점  계산
    const userTotalRatingAverage =
      userRating.ratingAverage *
      RatingTypes.length *
      userRating.totalReviewCount;
    const totalRating = totalNewRating - totalOldRating;
    const userReviewCountPerRatingType = userReviewCount * RatingTypes.length;

    updateData.userRatingAverage =
      Math.round(
        ((userTotalRatingAverage + totalRating) /
          userReviewCountPerRatingType) *
          10000,
      ) / 10000;
  }

  updateData.reviewCount = placeReviewCount;

  return updateData;
}
