export class TaskError extends Error {
  constructor(
    public readonly message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
  }
}

export class TaskNotFoundError extends TaskError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError);
  }
}

export class TaskConversionError extends TaskError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError);
  }
}
