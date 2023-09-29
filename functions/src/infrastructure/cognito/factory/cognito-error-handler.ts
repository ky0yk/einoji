import {
  AuthenticationError,
  CognitoError,
  CognitoInternalError,
  UserAliasExistsError,
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
    case 'UserNotConfirmedException':
      return new AuthenticationError(error.message, error);
    case 'UserNotFoundException':
      return new UserNotFoundError(error.message, error);
    case 'InternalErrorException':
    default:
      return new CognitoInternalError(error.message, error);
  }
};
