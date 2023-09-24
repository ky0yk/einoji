import { InfraBaseError } from '../../base/errors/infra-base-error';

export class DdbError extends InfraBaseError {
  constructor(
    public readonly message: string,
    public readonly originalError?: Error,
  ) {
    super(message, originalError);
  }
}

export class DdbResourceNotFoundError extends DdbError {}
export class DdbProvisionedThroughputExceededError extends DdbError {}
export class DdbValidationError extends DdbError {}
export class DdbInternalServerError extends DdbError {}
