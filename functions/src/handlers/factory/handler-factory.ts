import { APIGatewayEvent, Context } from 'aws-lambda';
import { logger } from '../../common/logger';
import { LambdaResponse, httpResponse } from '../http/http-response';
import { ErrorCode } from '../../common/error-codes';
import { AppError } from '../../common/app-errors';
import { httpErrorHandler } from './http-error-handler';

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
  errorHandler: RequestErrorHandler = httpErrorHandler,
): RequestHandler => {
  return async (event, context) => {
    try {
      logger.addContext(context);
      return await requestHandlerWithLog(name, requestHandler, event);
    } catch (e: unknown) {
      return await requestErrorHandlerWithLog(name, errorHandler, e);
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
