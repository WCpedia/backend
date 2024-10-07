export enum UserExceptionEnum {
  USER_NOT_FOUND = 'UserNotFound',
  USER_ALREADY_EXISTS = 'UserAlreadyExists',
  USER_DELETED = 'UserDeleted',
}

export const UserExceptionMessage = {
  [UserExceptionEnum.USER_NOT_FOUND]: '존재하지 않는 유저입니다.',
  [UserExceptionEnum.USER_ALREADY_EXISTS]: '이미 존재하는 유저입니다.',
  [UserExceptionEnum.USER_DELETED]: '탈퇴한 유저입니다.',
};
