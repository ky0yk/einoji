export class DdbError extends Error {
  constructor(
    message: string,
    public originalError?: any,
  ) {
    super(message);
  }
}

export class DdbServerError extends DdbError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
  }
}

export class DdbClientError extends DdbError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
  }
}
