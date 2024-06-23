import { VisitTime } from '@prisma/client';

export interface IComparedReviewImages {
  imagesToAdd: string[];
  imagesToDelete: number[];
}

export interface IReviewUpdateData {
  accessibilityRating: number;
  facilityRating: number;
  cleanlinessRating: number;
  visitTime?: VisitTime;
  description?: string;
}

export interface IPlaceReviewSnapshot {
  placeId: number;
  placeReviewId: number;
  userId: number;
  accessibilityRating: number;
  facilityRating: number;
  cleanlinessRating: number;
  visitTime: VisitTime;
  description: string;
}
