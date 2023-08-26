export class DdbError extends Error {
  originalError: Error;

  constructor(message: string, originalError: Error) {
    super(message);
    this.originalError = originalError;
  }
}

export class DdbResourceNotFoundError extends DdbError {
  constructor(message: string, originalError: Error) {
    super(message, originalError);
  }
}

export class DdbProvisionedThroughputExceededError extends DdbError {
  constructor(message: string, originalError: Error) {
    super(message, originalError);
  }
}

export class DdbValidationError extends DdbError {
  constructor(message: string, originalError: Error) {
    super(message, originalError);
  }
}

export class DdbInternalServerError extends DdbError {
  constructor(message: string, originalError: Error) {
    super(message, originalError);
  }
}
