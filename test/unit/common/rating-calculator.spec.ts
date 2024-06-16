import { RatingCalculator } from '../rating-calculator';
import { CalculateOperation } from '@enums/calculate-operation.enum';
import {
  IPlaceRatingInfo,
  IUserRatingInfo,
} from '@src/interface/common.interface';

describe('RatingCalculator', () => {
  let placeRatingInfo: IPlaceRatingInfo;
  let userRatingInfo: IUserRatingInfo;

  beforeAll(() => {
    placeRatingInfo = {
      facilityRating: 3.2564,
      accessibilityRating: 4.6852,
      cleanlinessRating: 1.7663,
      reviewCount: 89,
    };

    userRatingInfo = {
      totalReviewCount: 119,
      ratingAverage: 3.6255,
    };
  });

  it('CREATE', () => {
    const newRatings = {
      facilityRating: 5,
      accessibilityRating: 5,
      cleanlinessRating: 5,
    };

    const calculatedRating = RatingCalculator(
      placeRatingInfo,
      userRatingInfo,
      CalculateOperation.CREATE,
      newRatings,
    );

    expect(calculatedRating.facilityRating).toEqual(3.2758);
    expect(calculatedRating.accessibilityRating).toEqual(4.6887);
    expect(calculatedRating.cleanlinessRating).toEqual(1.8022);
    expect(calculatedRating.reviewCount).toEqual(90);
    expect(calculatedRating.userRatingAverage).toEqual(3.637);
  });

  it('DELETE', () => {
    const oldRatings = {
      facilityRating: 3,
      accessibilityRating: 5,
      cleanlinessRating: 2,
    };

    const calculatedRating = RatingCalculator(
      placeRatingInfo,
      userRatingInfo,
      CalculateOperation.DELETE,
      undefined,
      oldRatings,
    );

    expect(calculatedRating.facilityRating).toEqual(3.2593);
    expect(calculatedRating.accessibilityRating).toEqual(4.6816);
    expect(calculatedRating.cleanlinessRating).toEqual(1.7636);
    expect(calculatedRating.reviewCount).toEqual(88);
    expect(calculatedRating.userRatingAverage).toEqual(3.628);
  });

  it('UPDATE', () => {
    const oldRatings = {
      facilityRating: 5,
      accessibilityRating: 5,
      cleanlinessRating: 5,
    };

    const newRatings = {
      facilityRating: 3,
      accessibilityRating: 3,
      cleanlinessRating: 3,
    };

    const calculatedRating = RatingCalculator(
      placeRatingInfo,
      userRatingInfo,
      CalculateOperation.UPDATE,
      newRatings,
      oldRatings,
    );

    expect(calculatedRating.facilityRating).toEqual(3.2339);
    expect(calculatedRating.accessibilityRating).toEqual(4.6627);
    expect(calculatedRating.cleanlinessRating).toEqual(1.7438);
    expect(calculatedRating.reviewCount).toEqual(89);
    expect(calculatedRating.userRatingAverage).toEqual(3.6087);
  });

  it('DELETE - 리뷰 데이터가 1개 일때', () => {
    const placeRatingInfo = {
      facilityRating: 3,
      accessibilityRating: 3,
      cleanlinessRating: 3,
      reviewCount: 1,
    };
    const oldRatings = {
      facilityRating: 3,
      accessibilityRating: 3,
      cleanlinessRating: 3,
    };

    const calculatedRating = RatingCalculator(
      placeRatingInfo,
      userRatingInfo,
      CalculateOperation.DELETE,
      undefined,
      oldRatings,
    );

    expect(calculatedRating.facilityRating).toEqual(null);
    expect(calculatedRating.accessibilityRating).toEqual(null);
    expect(calculatedRating.cleanlinessRating).toEqual(null);
    expect(calculatedRating.reviewCount).toEqual(0);
    expect(calculatedRating.userRatingAverage).toEqual(3.6308);
  });

  it('DELETE - 유저 리뷰 데이터가 1개 일때', () => {
    const userRatingInfo = {
      totalReviewCount: 1,
      ratingAverage: 3,
    };

    const oldRatings = {
      facilityRating: 3,
      accessibilityRating: 5,
      cleanlinessRating: 2,
    };

    const calculatedRating = RatingCalculator(
      placeRatingInfo,
      userRatingInfo,
      CalculateOperation.DELETE,
      undefined,
      oldRatings,
    );

    expect(calculatedRating.facilityRating).toEqual(3.2593);
    expect(calculatedRating.accessibilityRating).toEqual(4.6816);
    expect(calculatedRating.cleanlinessRating).toEqual(1.7636);
    expect(calculatedRating.reviewCount).toEqual(88);
    expect(calculatedRating.userRatingAverage).toEqual(0);
  });

  it('DELETE - 유저, 리뷰 데이터가 1개 일때', () => {
    const userRatingInfo = {
      totalReviewCount: 1,
      ratingAverage: 3,
    };

    const placeRatingInfo = {
      facilityRating: 3,
      accessibilityRating: 3,
      cleanlinessRating: 3,
      reviewCount: 1,
    };
    const oldRatings = {
      facilityRating: 3,
      accessibilityRating: 3,
      cleanlinessRating: 3,
    };

    const calculatedRating = RatingCalculator(
      placeRatingInfo,
      userRatingInfo,
      CalculateOperation.DELETE,
      undefined,
      oldRatings,
    );

    expect(calculatedRating.facilityRating).toEqual(null);
    expect(calculatedRating.accessibilityRating).toEqual(null);
    expect(calculatedRating.cleanlinessRating).toEqual(null);
    expect(calculatedRating.reviewCount).toEqual(0);
    expect(calculatedRating.userRatingAverage).toEqual(0);
  });
});
