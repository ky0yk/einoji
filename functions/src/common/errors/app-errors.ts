import { ErrorCode } from './error-codes';
import { ERROR_MESSAGES } from './error-messsages';

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string = ERROR_MESSAGES[code],
    public originalError?: Error,
  ) {
    super(message);
  }
}
