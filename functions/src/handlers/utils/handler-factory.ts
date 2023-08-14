import { APIGatewayEvent, Context } from 'aws-lambda';
import { logger } from '../../common/logger';
import { LambdaResponse, httpResponse } from './http-response';
import { ErrorCode } from '../../common/error-codes';
import { AppError } from '../../common/app-errors';

export type RequestHandler = (
  event: APIGatewayEvent,
  context: Context,
) => Promise<LambdaResponse>;
export type RequestHandlerWithoutContext = (
  event: APIGatewayEvent,
) => Promise<LambdaResponse>;
export type RequestErrorHandler = (error: AppError) => Promise<LambdaResponse>;

// NOTE: 現状の動的に関数名を取得する方法はミニフィケーションや難読化に対応できない
export const handlerFactory = (
  requestHandler: RequestHandlerWithoutContext,
  requestErrorHandler: RequestErrorHandler,
): RequestHandler => {
  return async (event, context) => {
    try {
      logger.addContext(context);
      return await requestHandlerWithLogging(requestHandler, event);
    } catch (e: unknown) {
      logger.error(`Error ${requestHandler.name}`, String(e));
      return await errorHandlerWithLogging(requestErrorHandler, e);
    }
  };
};

const requestHandlerWithLogging = async (
  requestHandler: RequestHandlerWithoutContext,
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  logger.info(`Start ${requestHandler.name}`);
  const handlerResult = await requestHandler(event);
  logger.info(`End ${requestHandler.name}`);
  return handlerResult;
};

const errorHandlerWithLogging = async (
  errorHandler: RequestErrorHandler,
  e: unknown,
): Promise<LambdaResponse> => {
  if (e instanceof AppError) {
    logger.info(`Start ${errorHandler.name}`);
    const errorResult = await errorHandler(e);
    logger.info(`End ${errorHandler.name}`, errorResult);
    return errorResult;
  } else {
    logger.info(`unexpected error occurred: ${errorHandler.name}}`);
    return httpResponse(500).withError(ErrorCode.UNKNOWN_ERROR);
  }
};
