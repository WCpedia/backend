import {
  ReportMainType,
  ReviewReportSubType,
  UserReportSubType,
} from '@prisma/client';

export interface CreateReportProps {
  mainType: ReportMainType;
  userReportSubType: UserReportSubType;
  reviewSubType: ReviewReportSubType;
  reporterId: number;
  targetUserId: number;
  targetReviewId: number;
  description: string;
}
