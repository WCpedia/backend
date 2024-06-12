import { RatingTypes } from '@api/place/constants/const/const';
import { ICalculatedRating } from '@api/place/interface/interface';
import { CalculateOperation } from '@enums/calculate-operation.enum';
import {
  IPlaceRatingInfo,
  IRatings,
  IUserRatingInfo,
} from '@src/interface/common.interface';

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation.CREATE,
  userNewReviewRatings: IRatings,
): ICalculatedRating;

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation.DELETE,
  userNewReviewRatings: undefined,
  userOldReviewRatings: IRatings,
): ICalculatedRating;

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation.UPDATE,
  userNewReviewRatings: IRatings,
  userOldReviewRatings: IRatings,
): ICalculatedRating;

export function RatingCalculator(
  place: IPlaceRatingInfo,
  userRating: IUserRatingInfo,
  operation: CalculateOperation,
  userNewReviewRatings?: IRatings, // 새 리뷰 평점, 생성 또는 업데이트 시 사용
  userOldReviewRatings?: IRatings, // 이전 리뷰 평점, 삭제 또는 업데이트 시 사용
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
    const userOldReviewRating = userOldReviewRatings
      ? userOldReviewRatings[ratingType]
      : 0;
    const userNewReviewRating = userNewReviewRatings
      ? userNewReviewRatings[ratingType]
      : 0;

    totalNewRating += userNewReviewRating;
    totalOldRating += userOldReviewRating;

    const updatedRating = calculateUpdatedRating(
      place[ratingType],
      place.reviewCount,
      userOldReviewRating,
      userNewReviewRating,
      placeReviewCount,
      operation,
    );

    acc[ratingType] =
      placeReviewCount > 0 ? Math.round(updatedRating * 10000) / 10000 : null;

    return acc;
  }, {} as ICalculatedRating);

  updateData.userRatingAverage = calculateUserRatingAverage(
    userRating,
    totalNewRating,
    totalOldRating,
    userReviewCount,
  );
  updateData.reviewCount = placeReviewCount;

  return updateData;
}

function calculateUpdatedRating(
  placeCurrentRating: number,
  reviewCount: number,
  userOldReviewRating: number,
  userNewReviewRating: number,
  placeReviewCount: number,
  operation: CalculateOperation,
): number {
  if (operation === CalculateOperation.DELETE) {
    return (
      (placeCurrentRating * reviewCount - userOldReviewRating) /
      placeReviewCount
    );
  } else {
    return (
      (placeCurrentRating * reviewCount -
        userOldReviewRating +
        userNewReviewRating) /
      placeReviewCount
    );
  }
}

function calculateUserRatingAverage(
  userRating: IUserRatingInfo,
  totalNewRating: number,
  totalOldRating: number,
  userReviewCount: number,
): number {
  if (userReviewCount === 0) {
    return 0;
  } else {
    const userTotalRatingAverage =
      userRating.ratingAverage *
      RatingTypes.length *
      userRating.totalReviewCount;
    const totalRatingChange = totalNewRating - totalOldRating;
    const userReviewCountPerRatingType = userReviewCount * RatingTypes.length;

    return (
      Math.round(
        ((userTotalRatingAverage + totalRatingChange) /
          userReviewCountPerRatingType) *
          10000,
      ) / 10000
    );
  }
}
