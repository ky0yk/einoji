import { HttpStatus } from './http-status';
import { ErrorCode } from '../../common/errors/error-codes';

export enum UserErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  TASK_NOT_AVAILABLE = 'TASK_NOT_AVAILABLE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SYSTEM_OVERLOAD = 'SYSTEM_OVERLOAD',
}

type UserErrorMessage = {
  [key in UserErrorCode]: string;
};

export const USER_ERROR_MESSAGES: UserErrorMessage = {
  [UserErrorCode.INVALID_REQUEST]:
    'Your request contains invalid data. Please check the input.',
  [UserErrorCode.TASK_NOT_AVAILABLE]:
    'The requested Task could not be found. Please verify the task information.',
  [UserErrorCode.SYSTEM_ERROR]:
    'An unexpected error occurred. Please try again later.',
  [UserErrorCode.SYSTEM_OVERLOAD]:
    'The system is currently overloaded. Please try again later.',
} as const;

export const errorCodeToUserErrorCode = (
  errorCode: ErrorCode,
): UserErrorCode => {
  switch (errorCode) {
    case ErrorCode.DDB_VALIDATION_ERROR:
    case ErrorCode.INVALID_REQUEST:
      return UserErrorCode.INVALID_REQUEST;

    case ErrorCode.TASK_NOT_FOUND:
      return UserErrorCode.TASK_NOT_AVAILABLE;

    case ErrorCode.DDB_RESOURCE_NOT_FOUND:
    case ErrorCode.DDB_INTERNAL_SERVER_ERROR:
    case ErrorCode.TASK_CONVERSION_ERROR:
    case ErrorCode.TASK_UNKNOWN_ERROR:
    case ErrorCode.UNKNOWN_ERROR:
      return UserErrorCode.SYSTEM_ERROR;

    case ErrorCode.DDB_THROUGHPUT_EXCEEDED:
      return UserErrorCode.SYSTEM_OVERLOAD;

    default: {
      const exhaustiveCheck: never = errorCode;
      throw new Error(`Unhandled error code: ${exhaustiveCheck}`);
    }
  }
};

export const userErrorCodeToHttpStatus = (
  userErrorCode: UserErrorCode,
): HttpStatus => {
  switch (userErrorCode) {
    case UserErrorCode.INVALID_REQUEST:
      return HttpStatus.BAD_REQUEST;

    case UserErrorCode.TASK_NOT_AVAILABLE:
      return HttpStatus.NOT_FOUND;

    case UserErrorCode.SYSTEM_ERROR:
      return HttpStatus.INTERNAL_SERVER_ERROR;

    case UserErrorCode.SYSTEM_OVERLOAD:
      return HttpStatus.SERVICE_UNAVAILABLE;

    default: {
      const exhaustiveCheck: never = userErrorCode;
      throw new Error(`Unhandled error code: ${exhaustiveCheck}`);
    }
  }
};
