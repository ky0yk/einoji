import {
  UserError,
  UserInvalidEmailError,
  UserInvalidPasswordError,
} from '../../../domain/user/errors/user-errors';
import {
  CognitoAliasExistsError,
  CognitoError,
  CognitoInternalError,
  CognitoInvalidParameterError,
  CognitoInvalidPasswordError,
  CognitoNotAuthorizedError,
  CognitoUserNotConfirmedError,
  CognitoUserNotFoundError,
} from '../../../infrastructure/cognito/errors/cognito-errors';
import { AppError } from '../../../utils/errors/app-errors';
import { ErrorCode } from '../../../utils/errors/error-codes';

export const userErrorHandler = (error: CognitoError | UserError): AppError => {
  if (error instanceof CognitoAliasExistsError) {
    return new AppError(ErrorCode.USER_ALIAS_EXISTS, error.message, error);
  }
  if (error instanceof CognitoNotAuthorizedError) {
    return new AppError(ErrorCode.USER_NOT_AUTHORIZED, error.message, error);
  }
  if (error instanceof CognitoInvalidPasswordError) {
    return new AppError(ErrorCode.INVALID_PASSWORD, error.message, error);
  }
  if (error instanceof CognitoUserNotConfirmedError) {
    return new AppError(ErrorCode.USER_NOT_CONFIRMED, error.message, error);
  }
  if (error instanceof CognitoUserNotFoundError) {
    return new AppError(ErrorCode.USER_NOT_FOUND, error.message, error);
  }
  if (error instanceof CognitoInvalidParameterError) {
    return new AppError(ErrorCode.INVALID_PARAMETER, error.message, error);
  }
  if (error instanceof CognitoInternalError) {
    return new AppError(ErrorCode.INTERNAL_ERROR, error.message, error);
  }

  if (error instanceof UserInvalidEmailError) {
    return new AppError(ErrorCode.INTERNAL_ERROR, error.message, error);
  }

  if (error instanceof UserInvalidPasswordError) {
    return new AppError(ErrorCode.INTERNAL_ERROR, error.message, error);
  }

  return new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error);
};
