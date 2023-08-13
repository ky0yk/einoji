import { ERROR_MESSAGES, ErrorCode } from './error-codes';

class AppError extends Error {
  constructor(
    public errorCode: ErrorCode,
    public message: string = ERROR_MESSAGES[errorCode],
    public originalError?: any,
  ) {
    super(message);
  }
}

export class ClientError extends AppError {
  constructor(errorCode: ErrorCode, originalError?: any) {
    super(errorCode, ERROR_MESSAGES[errorCode], originalError);
  }
}

export class ServerError extends AppError {
  constructor(errorCode: ErrorCode, originalError?: any) {
    super(errorCode, ERROR_MESSAGES[errorCode], originalError);
  }
}
