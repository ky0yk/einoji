import { ErrorCode } from './error-codes';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
  }
}
