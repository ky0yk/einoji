import {
  AuthenticationError,
  CognitoInternalError,
  UserAliasExistsError,
  UserNotFoundError,
} from '../../../../../src/infrastructure/cognito/errors/cognito-errors';
import { cognitoErrorHandler } from '../../../../../src/infrastructure/cognito/factory/cognito-error-handler';

describe('cognitoErrorHandler', () => {
  describe('When error is already an instance of CognitoError', () => {
    it('should return the original error', () => {
      const predefinedCognitoError = new CognitoInternalError(
        'Dummy error message',
      );
      const resultingError = cognitoErrorHandler(predefinedCognitoError);
      expect(resultingError).toBe(predefinedCognitoError);
    });
  });

  describe('When error is not an instance of CognitoError', () => {
    test.each`
      original_error_name            | expected_error_class
      ${'AliasExistsException'}      | ${UserAliasExistsError}
      ${'UsernameExistsException'}   | ${UserAliasExistsError}
      ${'NotAuthorizedException'}    | ${AuthenticationError}
      ${'InvalidPasswordException'}  | ${AuthenticationError}
      ${'UserNotConfirmedException'} | ${AuthenticationError}
      ${'UserNotFoundException'}     | ${UserNotFoundError}
      ${'InternalErrorException'}    | ${CognitoInternalError}
      ${'SomeUnknownException'}      | ${CognitoInternalError}
    `(
      'given an error with name $original_error_name it should return an instance of $expected_error_class',
      ({ original_error_name, expected_error_class }) => {
        const originalError = new Error('Dummy error message');
        originalError.name = original_error_name;

        const returnedError = cognitoErrorHandler(originalError);
        expect(returnedError).toBeInstanceOf(expected_error_class);
      },
    );
  });
});
