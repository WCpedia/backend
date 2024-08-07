export const DOMAIN_NAME = {
  SEARCH: 'search',
  PLACE: 'places',
  USER: 'users',
  MY: 'my',
  AUTH: 'auth',
  AUTH_TOKEN: 'auth/token',
  FEEDBACK: 'feedback',
  REVIEW: 'reviews',
  REPORT: 'report',
  BLOCK: 'block',
  ADMIN: process.env.ADMIN_PATH,
  ADMIN_FACILITY: `${process.env.ADMIN_PATH}/facility`,
  ADMIN_PLACE: `${process.env.ADMIN_PATH}/places`,
  ADMIN_USER: `${process.env.ADMIN_PATH}/users`,
  ADMIN_REPORT: `${process.env.ADMIN_PATH}/reports`,
  ADMIN_FEEDBACK: `${process.env.ADMIN_PATH}/feedbacks`,
};
