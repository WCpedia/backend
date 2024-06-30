import { CreateReportProps } from '@api/report/interface/interface';
import Report from '@api/report/report';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReportExceptionEnum } from '@exceptions/http/enums/report.exception.enum';
import {
  Report as PrismaReport,
  ReportMainType,
  ReviewReportSubType,
  UserReportSubType,
} from '@prisma/client';

describe('Report', () => {
  const createReport = (overrides?: Partial<PrismaReport>) =>
    new Report({
      id: 1,
      mainType: ReportMainType.USER,
      userReportSubType: UserReportSubType.DESCRIPTION,
      reviewSubType: null,
      reporterId: 1,
      targetUserId: 2,
      targetReviewId: null,
      description: null,
      ...overrides,
    });

  describe('create', () => {
    const createUserReportData = (overrides?: Partial<CreateReportProps>) => ({
      mainType: ReportMainType.USER,
      userReportSubType: UserReportSubType.DESCRIPTION,
      reviewSubType: null,
      reporterId: 1,
      targetUserId: 2,
      targetReviewId: null,
      description: null,
      ...overrides,
    });

    const createReviewReportData = (
      overrides?: Partial<CreateReportProps>,
    ) => ({
      mainType: ReportMainType.REVIEW,
      userReportSubType: null,
      reviewSubType: ReviewReportSubType.FALSE_INFO,
      reporterId: 1,
      targetUserId: 2,
      targetReviewId: 1,
      description: null,
      ...overrides,
    });
    describe('성공적으로 생성되어야 한다', () => {
      it('유저 신고', () => {
        const reportData = createUserReportData();
        const report = Report.create(reportData);

        expect(report.createData).toEqual(reportData);
      });

      it('리뷰 신고', () => {
        const reportData = createReviewReportData();
        const report = Report.create(reportData);

        expect(report.createData).toEqual(reportData);
      });
    });

    describe('ETC SubType 처리', () => {
      it('유저 신고가 성공적으로 생성되어야 한다.', () => {
        const reportData = createUserReportData({
          userReportSubType: UserReportSubType.ETC,
          description: 'description',
        });
        const report = Report.create(reportData);

        expect(report.createData).toEqual(reportData);
      });

      it('리뷰 신고가 성공적으로 생성되어야 한다.', () => {
        const reportData = createReviewReportData({
          reviewSubType: ReviewReportSubType.ETC,
          description: 'description',
          targetReviewId: 1,
        });
        const report = Report.create(reportData);

        expect(report.createData).toEqual(reportData);
      });

      it('description이 없으면 예외가 발생한다.', () => {
        const reportData = createUserReportData({
          userReportSubType: UserReportSubType.ETC,
          description: null,
        });

        expect(() => {
          Report.create(reportData);
        }).toThrow(
          new CustomException(
            HttpExceptionStatusCode.BAD_REQUEST,
            ReportExceptionEnum.DESCRIPTION_REQUIRED_FOR_ETC,
          ),
        );
      });

      it('description이 없으면 예외가 발생한다.', () => {
        const reportData = createReviewReportData({
          reviewSubType: ReviewReportSubType.ETC,
          description: null,
          targetReviewId: 1,
        });

        expect(() => {
          Report.create(reportData);
        }).toThrow(
          new CustomException(
            HttpExceptionStatusCode.BAD_REQUEST,
            ReportExceptionEnum.DESCRIPTION_REQUIRED_FOR_ETC,
          ),
        );
      });
    });

    describe('신고 SubType이 모두 null일 때 예외가 발생한다.', () => {
      it('유저 신고', () => {
        const reportData = createUserReportData({
          userReportSubType: null,
          reviewSubType: null,
        });

        expect(() => {
          Report.create(reportData);
        }).toThrow(
          new CustomException(
            HttpExceptionStatusCode.BAD_REQUEST,
            ReportExceptionEnum.SUB_TYPE_REQUIRED,
          ),
        );
      });

      it('리뷰 신고', () => {
        const reportData = createReviewReportData({
          userReportSubType: null,
          reviewSubType: null,
        });

        expect(() => {
          Report.create(reportData);
        }).toThrow(
          new CustomException(
            HttpExceptionStatusCode.BAD_REQUEST,
            ReportExceptionEnum.SUB_TYPE_REQUIRED,
          ),
        );
      });
    });

    describe('신고 유형에 맞지 않는 SubType이 포함되면 예외가 발생한다.', () => {
      it('유저 신고', () => {
        const reportData = createUserReportData({
          userReportSubType: null,
          reviewSubType: ReviewReportSubType.FALSE_INFO,
        });

        expect(() => {
          Report.create(reportData);
        }).toThrow(
          new CustomException(
            HttpExceptionStatusCode.BAD_REQUEST,
            ReportExceptionEnum.USER_SUB_TYPE_REQUIRED,
          ),
        );
      });

      it('리뷰 신고', () => {
        const reportData = createReviewReportData({
          userReportSubType: UserReportSubType.NICKNAME,
          reviewSubType: null,
        });

        expect(() => {
          Report.create(reportData);
        }).toThrow(
          new CustomException(
            HttpExceptionStatusCode.BAD_REQUEST,
            ReportExceptionEnum.REVIEW_SUB_TYPE_REQUIRED,
          ),
        );
      });
    });

    it('본인 신고시 예외가 발생한다.', () => {
      const reportData = createUserReportData({
        reporterId: 1,
        targetUserId: 1,
      });

      expect(() => {
        Report.create(reportData);
      }).toThrow(
        new CustomException(
          HttpExceptionStatusCode.BAD_REQUEST,
          ReportExceptionEnum.SELF_REPORT_NOT_ALLOWED,
        ),
      );
    });

    it('신고 대상이 Review일때 targetReviewId가 없으면 예외가 발생한다.', () => {
      const reportData = createReviewReportData({
        reviewSubType: ReviewReportSubType.FALSE_INFO,
        targetReviewId: null,
      });

      expect(() => {
        Report.create(reportData);
      }).toThrow(
        new CustomException(
          HttpExceptionStatusCode.BAD_REQUEST,
          ReportExceptionEnum.REVIEW_ID_REQUIRED,
        ),
      );
    });

    it('유저 신고와 리뷰 신고가 동시에 선택되면 예외가 발생한다.', () => {
      const reportData = createUserReportData({
        userReportSubType: UserReportSubType.DESCRIPTION,
        reviewSubType: ReviewReportSubType.FALSE_INFO,
      });

      expect(() => {
        Report.create(reportData);
      }).toThrow(
        new CustomException(
          HttpExceptionStatusCode.BAD_REQUEST,
          ReportExceptionEnum.MULTIPLE_SUB_TYPES_NOT_ALLOWED,
        ),
      );
    });

    it('유저 신고시 ReviewId가 있으면 예외가 발생한다.', () => {
      const reportData = createUserReportData({
        targetReviewId: 1,
      });

      expect(() => {
        Report.create(reportData);
      }).toThrow(
        new CustomException(
          HttpExceptionStatusCode.BAD_REQUEST,
          ReportExceptionEnum.REVIEW_ID_NOT_ALLOWED,
        ),
      );
    });
  });

  describe('isCreatedToday', () => {
    const createReport = (createdAt: Date) => {
      return new Report({
        id: 1,
        mainType: ReportMainType.USER,
        userReportSubType: UserReportSubType.DESCRIPTION,
        reviewSubType: null,
        reporterId: 1,
        targetUserId: 2,
        targetReviewId: null,
        description: 'Test description',
        createdAt: createdAt,
        deletedAt: null,
        isResolved: false,
      });
    };

    it('생성일과 동일한 날짜인 경우 true를 반환한다.', () => {
      const today = new Date();
      const report = createReport(today);

      expect(report.isCreatedToday()).toBe(true);
    });

    it('생성일과 다른 날짜인 경우 false를 반환한다', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const report = createReport(yesterday);

      expect(report.isCreatedToday()).toBe(false);
    });
  });

  describe('validateAuthor', () => {
    it('신고자와 동일하면 통과한다.', () => {
      const report = createReport({
        reporterId: 1,
      });
      const userId = 1;

      expect(() => {
        report.validateAuthor(userId);
      }).not.toThrow();
    });

    it('신고자와 동일하지 않으면 예외가 발생한다.', () => {
      const report = createReport({
        reporterId: 1,
      });
      const userId = 2;

      expect(() => {
        report.validateAuthor(userId);
      }).toThrow(
        new CustomException(
          HttpExceptionStatusCode.FORBIDDEN,
          ReportExceptionEnum.MISMATCHED_AUTHOR,
        ),
      );
    });
  });

  describe('isDeleted', () => {
    it('deletedAt이 null이면 false를 반환한다.', () => {
      const report = createReport({
        deletedAt: null,
      });

      expect(report.isDeleted()).toBe(false);
    });

    it('deletedAt이 null이 아니면 true를 반환한다.', () => {
      const report = createReport({
        deletedAt: new Date(),
      });

      expect(report.isDeleted()).toBe(true);
    });
  });
});
