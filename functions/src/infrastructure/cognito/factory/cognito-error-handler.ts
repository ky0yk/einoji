import {
  AuthenticationError,
  CognitoError,
  CognitoInternalError,
  UserAliasExistsError,
  UserConfirmationRequiredError,
  UserNotFoundError,
} from '../errors/cognito-errors';

export const cognitoErrorHandler = (error: Error): CognitoError => {
  if (error instanceof CognitoError) {
    return error;
  }
  switch (error.name) {
    case 'AliasExistsException':
    case 'UsernameExistsException':
      return new UserAliasExistsError(error.message, error);
    case 'NotAuthorizedException':
    case 'InvalidPasswordException':
      return new AuthenticationError(error.message, error);
    case 'UserNotConfirmedException':
      return new UserConfirmationRequiredError(error.message, error);
    case 'UserNotFoundException':
      return new UserNotFoundError(error.message, error);
    case 'InternalErrorException':
    default:
      return new CognitoInternalError(error.message, error);
  }
};
