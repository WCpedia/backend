import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReportExceptionEnum } from '@exceptions/http/enums/report.exception.enum';
import {
  Report as PrismaReport,
  ReportMainType,
  ReviewReportSubType,
  UserReportSubType,
} from '@prisma/client';
import { CreateReportProps } from './interface/interface';

interface ReportProps extends Partial<PrismaReport> {}

export default class Report {
  private _id: number | null;
  private _mainType: ReportMainType;
  private _userReportSubType: UserReportSubType;
  private _reviewSubType: ReviewReportSubType;
  private _reporterId: number;
  private _targetUserId: number;
  private _targetReviewId: number;
  private _description: string;
  private _createdAt: Date;
  private _deletedAt: Date;
  private _isResolved: boolean;

  constructor(props: ReportProps) {
    this._id = props.id;
    this._mainType = props.mainType;
    this._userReportSubType = props.userReportSubType;
    this._reviewSubType = props.reviewSubType;
    this._reporterId = props.reporterId;
    this._targetUserId = props.targetUserId;
    this._targetReviewId = props.targetReviewId;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._deletedAt = props.deletedAt;
    this._isResolved = props.isResolved;
  }

  static create({
    mainType,
    userReportSubType,
    reviewSubType,
    reporterId,
    targetUserId,
    targetReviewId,
    description,
  }: CreateReportProps): Report {
    this.validateSelfReport(reporterId, targetUserId);
    this.validateSubType(
      mainType,
      userReportSubType,
      reviewSubType,
      description,
      targetReviewId,
    );

    return new Report({
      mainType,
      userReportSubType,
      reviewSubType,
      reporterId,
      targetUserId,
      targetReviewId,
      description,
    });
  }

  private static validateSelfReport(
    reporterId: number,
    targetUserId: number,
  ): void {
    if (reporterId === targetUserId) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReportExceptionEnum.SELF_REPORT_NOT_ALLOWED,
      );
    }
  }

  private static validateSubType(
    mainType: ReportMainType,
    userSubType: UserReportSubType,
    reviewSubType: ReviewReportSubType,
    description: string,
    targetReviewId: number,
  ): void {
    if (userSubType === null && reviewSubType === null) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReportExceptionEnum.SUB_TYPE_REQUIRED,
      );
    }
    if (mainType === ReportMainType.USER && userSubType === null) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReportExceptionEnum.USER_SUB_TYPE_REQUIRED,
      );
    }
    if (mainType === ReportMainType.REVIEW) {
      if (reviewSubType === null) {
        throw new CustomException(
          HttpExceptionStatusCode.BAD_REQUEST,
          ReportExceptionEnum.REVIEW_SUB_TYPE_REQUIRED,
        );
      }
      if (targetReviewId === null) {
        throw new CustomException(
          HttpExceptionStatusCode.BAD_REQUEST,
          ReportExceptionEnum.REVIEW_ID_REQUIRED,
        );
      }
    }
    if (
      (userSubType === UserReportSubType.ETC ||
        reviewSubType === ReviewReportSubType.ETC) &&
      !description
    ) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReportExceptionEnum.DESCRIPTION_REQUIRED_FOR_ETC,
      );
    }
  }

  get createData() {
    return {
      mainType: this._mainType,
      userReportSubType: this._userReportSubType,
      reviewSubType: this._reviewSubType,
      reporterId: this._reporterId,
      targetUserId: this._targetUserId,
      targetReviewId: this._targetReviewId,
      description: this._description,
    };
  }
}
