export const UploadFileLimit = {
  SINGLE: 1,
  REVIEW_IMAGES: 5,
  REPORT_FACILITY_IMAGES: 5,
} as const;

export const FilePath = {
  USER: 'users',
  PLACE: 'places',
  REVIEW: 'reviews',
  REPORT_FACILITY: 'reports/facility',
} as const;
