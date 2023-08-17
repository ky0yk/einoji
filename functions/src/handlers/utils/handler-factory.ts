import { APIGatewayEvent, Context } from 'aws-lambda';
import { logger } from '../../common/logger';
import { HttpStatus, LambdaResponse, httpResponse } from './http-response';
import { ErrorCode } from '../../common/error-codes';
import { AppError, ClientError } from '../../common/app-errors';

export type RequestHandler = (
  event: APIGatewayEvent,
  context: Context,
) => Promise<LambdaResponse>;
export type RequestHandlerWithoutContext = (
  event: APIGatewayEvent,
) => Promise<LambdaResponse>;
export type RequestErrorHandler = (error: AppError) => Promise<LambdaResponse>;

export const handlerFactory = (
  name: string,
  requestHandler: RequestHandlerWithoutContext,
  requestErrorHandler: RequestErrorHandler = defaultErrorHandler,
): RequestHandler => {
  return async (event, context) => {
    try {
      logger.addContext(context);
      return await requestHandlerWithLog(name, requestHandler, event);
    } catch (e: unknown) {
      return await requestErrorHandlerWithLog(name, requestErrorHandler, e);
    }
  };
};

const requestHandlerWithLog = async (
  name: string,
  requestHandler: RequestHandlerWithoutContext,
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  logger.info(`START handler: ${name}`);
  const result = await requestHandler(event);
  logger.info(`EXIT handler: ${name}`);
  return result;
};

const requestErrorHandlerWithLog = async (
  name: string,
  requestErrorHandler: RequestErrorHandler,
  e: unknown,
): Promise<LambdaResponse> => {
  logger.error(`An error occurred in handler: ${name}`);
  if (e instanceof AppError) {
    logger.error(`START Error handling: ${name}`, e);
    const errorResult = await requestErrorHandler(e);
    logger.info(`EXIT Error handling: ${name}`);
    return errorResult;
  } else {
    logger.error(`An unexpected error occurred in handler: ${name}`, String(e));
    return httpResponse(500).withError(ErrorCode.UNKNOWN_ERROR);
  }
};

const defaultErrorHandler: RequestErrorHandler = async (
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
