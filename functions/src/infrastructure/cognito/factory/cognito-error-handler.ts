import {
  CognitoAliasExistsError,
  CognitoError,
  CognitoInternalError,
  CognitoInvalidParameterError,
  CognitoInvalidPasswordError,
  CognitoNotAuthorizedError,
  CognitoUserNotConfirmedError,
  CognitoUserNotFoundError,
} from '../errors/cognito-errors';

export const cognitoErrorHandler = (error: Error): CognitoError => {
  switch (error.name) {
    case 'AliasExistsException':
      throw new CognitoAliasExistsError(error.message, error);
    case 'NotAuthorizedException':
      throw new CognitoNotAuthorizedError(error.message, error);
    case 'InvalidPasswordException':
      throw new CognitoInvalidPasswordError(error.message, error);
    case 'UserNotConfirmedException':
      throw new CognitoUserNotConfirmedError(error.message, error);
    case 'UserNotFoundException':
      throw new CognitoUserNotFoundError(error.message, error);
    case 'InvalidParameterException':
      throw new CognitoInvalidParameterError(error.message, error);
    case 'InternalErrorException':
      throw new CognitoInternalError(error.message, error);
    default:
      throw new CognitoInternalError(error.message, error);
  }
};
