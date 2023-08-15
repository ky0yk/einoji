export class DdbError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
  }
}

export class DdbServerError extends DdbError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError);
  }
}

export class DdbClientError extends DdbError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError);
  }
}

export class DdbUnknownError extends DdbError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError);
  }
}
