import {
  UserInvalidEmailError,
  UserInvalidPasswordError,
} from '../../../domain/user/errors/user-errors';
import {
  AuthenticationError,
  UserAliasExistsError,
  UserNotFoundError,
} from '../../../infrastructure/cognito/errors/cognito-errors';
import { AppError } from '../../../utils/errors/app-errors';
import { ErrorCode } from '../../../utils/errors/error-codes';

export const userUsecaseErrorHandler = (error: Error): AppError => {
  if (error instanceof UserInvalidEmailError) {
    return new AppError(ErrorCode.INVALID_EMAIL_FORMAT, error.message);
  }
  if (error instanceof UserInvalidPasswordError) {
    return new AppError(ErrorCode.INVALID_PASSWORD_FORMAT, error.message);
  }
  if (error instanceof AuthenticationError) {
    return new AppError(ErrorCode.INVALID_CREDENTIALS, error.message);
  }
  if (error instanceof UserNotFoundError) {
    return new AppError(ErrorCode.USER_NOT_FOUND, error.message);
  }
  if (error instanceof UserAliasExistsError) {
    return new AppError(ErrorCode.USER_ALIAS_EXISTS, error.message);
  }
  return new AppError(ErrorCode.UNKNOWN_ERROR, 'An unexpected error occurred.');
};
