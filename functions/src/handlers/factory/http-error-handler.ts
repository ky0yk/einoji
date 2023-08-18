import { AppError, ClientError } from '../../common/app-errors';
import { ErrorCode } from '../../common/error-codes';
import {
  HttpStatus,
  LambdaResponse,
  httpResponse,
} from '../http/http-response';
import { RequestErrorHandler } from './handler-factory';

export const httpErrorHandler: RequestErrorHandler = async (
  error: AppError,
): Promise<LambdaResponse> => {
  switch (error.code) {
    case ErrorCode.TASK_NOT_FOUND:
      return httpResponse(HttpStatus.NOT_FOUND).withError(
        ErrorCode.TASK_NOT_FOUND,
      );
    case ErrorCode.DDB_CLIENT_ERROR:
      return httpResponse(HttpStatus.BAD_REQUEST).withError(
        ErrorCode.DDB_CLIENT_ERROR,
      );
    case ErrorCode.DDB_SERVER_ERROR:
      return httpResponse(HttpStatus.INTERNAL_SERVER_ERROR).withError(
        ErrorCode.DDB_SERVER_ERROR,
      );
    case ErrorCode.DDB_UNKNOWN_ERROR:
      return httpResponse(HttpStatus.INTERNAL_SERVER_ERROR).withError(
        ErrorCode.DDB_UNKNOWN_ERROR,
      );
    default:
      if (error instanceof ClientError) {
        return httpResponse(HttpStatus.BAD_REQUEST).withError(
          ErrorCode.INVALID_REQUEST,
        );
      } else {
        return httpResponse(HttpStatus.INTERNAL_SERVER_ERROR).withError(
          ErrorCode.UNKNOWN_ERROR,
        );
      }
  }
};
