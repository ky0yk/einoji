import { ERROR_MESSAGES, ErrorCode } from './error-codes';

class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string = ERROR_MESSAGES[code],
    public originalError?: any,
  ) {
    super(message);
  }
}

export class ClientError extends AppError {
  constructor(code: ErrorCode, originalError?: any) {
    super(code, ERROR_MESSAGES[code], originalError);
  }
}

export class ServerError extends AppError {
  constructor(code: ErrorCode, originalError?: any) {
    super(code, ERROR_MESSAGES[code], originalError);
  }
}
