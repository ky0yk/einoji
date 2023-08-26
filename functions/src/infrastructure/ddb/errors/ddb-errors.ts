export class DdbError extends Error {
  constructor(
    public message: string,
    public originalError?: Error,
  ) {
    super(message);
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
