import {
  Report as PrismaReport,
  ReportMainType,
  ReviewReportSubType,
  UserReportSubType,
} from '@prisma/client';

type WithPrefix<T> = {
  [K in keyof T as `_${string & K}`]: T[K];
};

export default class Report implements WithPrefix<PrismaReport> {
  _id: number;
  _mainType: ReportMainType;
  _userReportSubType: UserReportSubType;
  _reviewSubType: ReviewReportSubType;
  _reporterId: number;
  _targetUserId: number;
  _targetReviewId: number;
  _description: string;
  _createdAt: Date;
  _deletedAt: Date;
  _isResolved: boolean;
}
