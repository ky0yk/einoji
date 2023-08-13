class TaskError extends Error {
  constructor(
    message: string,
    public originalError?: any,
  ) {
    super(message);
  }
}

export class TaskNotFoundError extends TaskError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
  }
}
