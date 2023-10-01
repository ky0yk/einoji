import { InfraError } from '../../base/errors/infra-errors';

export class CognitoError extends InfraError {
  constructor(
    public readonly message: string,
    public readonly originalError?: Error,
  ) {
    super(message, originalError);
  }
}

export class AuthenticationError extends CognitoError {}
export class UserNotFoundError extends CognitoError {}
export class UserAliasExistsError extends CognitoError {}
export class CognitoInternalError extends CognitoError {}
