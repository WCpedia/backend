export enum ReviewExceptionEnum {
  ALREADY_REVIEWED = 'AlreadyReviewed',
  REVIEW_NOT_EXIST = 'ReviewNotExist',
  ALREADY_HELPFUL_REVIEWED = 'AlreadyHelpfulReviewed',
  SELF_HELPFUL_REVIEW_FORBIDDEN = 'SelfHelpfulReviewForbidden',
  HELPFUL_REVIEW_NOT_EXIST = 'HelpfulReviewNotExist',
  NOT_AUTHORIZED = 'NotAuthorized',
  MISMATCHED_AUTHOR = 'MismatchedAuthor',
  REVIEW_IMAGE_LIMIT_EXCEEDED = 'ReviewImageLimitExceeded',
}
