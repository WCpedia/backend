import { PrismaService } from '@src/core/database/prisma/services/prisma.service';

export interface IPaginationOptions {
  take: number;
  currentPage?: number;
  targetPage?: number;
  firstItemId?: number;
  lastItemId?: number;
}

export interface IPaginationParams {
  cursor: ICursor | null;
  skip: number | null;
  take: number | null;
}

export interface ICursor {
  id: number;
}

export interface IExtractedRegion {
  administrativeDistrict: string;
  district: string;
  detailAddress: string;
}

export interface IPlaceCategory {
  fullCategoryIds: string;
  lastDepth: number;
  depth1Id: number;
  depth2Id?: number;
  depth3Id?: number;
  depth4Id?: number;
  depth5Id?: number;
}

export interface IUploadFileParams {
  maxCount: number;
  path: string;
}

export interface IRatings {
  accessibilityRating: number;
  facilityRating: number;
  cleanlinessRating: number;
}

export interface IUserRatingInfo {
  totalReviewCount?: number;
  ratingAverage?: number;
}

export interface IPlaceRatingInfo extends IRatings {
  reviewCount: number;
}
