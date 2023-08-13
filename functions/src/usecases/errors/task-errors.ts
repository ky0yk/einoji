class TaskError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
  }
}

export class TaskNotFoundError extends TaskError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError);
  }
}
