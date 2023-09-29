import {
  UserInvalidEmailError,
  UserInvalidPasswordError,
} from '../../../../../src/domain/user/errors/user-errors';
import {
  AuthenticationError,
  UserAliasExistsError,
  UserNotFoundError,
} from '../../../../../src/infrastructure/cognito/errors/cognito-errors';
import { userUsecaseErrorHandler } from '../../../../../src/usecases/users/factory/user-usecase-error-handler';
import { AppError } from '../../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../../src/utils/errors/error-codes';

describe('userUsecaseErrorHandler', () => {
  const originalError = new Error('Original error message');

  test.each`
    error_instance                                 | expected_error_code
    ${new UserInvalidEmailError('')}               | ${ErrorCode.INVALID_EMAIL_FORMAT}
    ${new UserInvalidPasswordError('')}            | ${ErrorCode.INVALID_PASSWORD_FORMAT}
    ${new AuthenticationError('', originalError)}  | ${ErrorCode.INVALID_CREDENTIALS}
    ${new UserNotFoundError('', originalError)}    | ${ErrorCode.USER_NOT_FOUND}
    ${new UserAliasExistsError('', originalError)} | ${ErrorCode.USER_ALIAS_EXISTS}
    ${new Error('Some other error')}               | ${ErrorCode.UNKNOWN_ERROR}
  `(
    'given $error_instance it should return an error with code $expected_error_code',
    ({ error_instance, expected_error_code }) => {
      const result = userUsecaseErrorHandler(error_instance);
      expect(result).toBeInstanceOf(AppError);
      expect(result.code).toBe(expected_error_code);
    },
  );
});
