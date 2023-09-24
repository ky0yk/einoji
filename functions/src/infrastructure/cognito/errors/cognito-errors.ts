import { InfraBaseError } from '../../base/errors/infra-base-error';

export class CognitoError extends InfraBaseError {
  constructor(
    public readonly message: string,
    public readonly originalError?: Error,
  ) {
    super(message, originalError);
  }
}

export class CognitoAliasExistsError extends CognitoError {}
export class CognitoNotAuthorizedError extends CognitoError {}
export class CognitoInvalidPasswordError extends CognitoError {}
export class CognitoUserNotConfirmedError extends CognitoError {}
export class CognitoUserNotFoundError extends CognitoError {}
export class CognitoInvalidParameterError extends CognitoError {}
export class CognitoInternalError extends CognitoError {}
