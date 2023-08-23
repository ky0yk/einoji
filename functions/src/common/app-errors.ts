import { ERROR_MESSAGES, ErrorCode } from './error-codes';

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string = ERROR_MESSAGES[code],
    public originalError?: Error,
  ) {
    super(message);
  }
}
