import { APIGatewayEvent, Context } from 'aws-lambda';
import { logger } from '../../src/common/logger';
import { LambdaResponse, httpResponse } from './http-response';
import { ErrorCode } from '../../src/common/error-codes';
import { AppError } from '../../src/common/app-errors';

export type RequestHandler = (
  event: APIGatewayEvent,
  context: Context,
) => Promise<LambdaResponse>;
export type RequestHandlerWithoutContext = (
  event: APIGatewayEvent,
) => Promise<LambdaResponse>;
export type ErrorHandler = (error: AppError) => Promise<LambdaResponse>;

// NOTE: 現状の動的に関数名を取得する方法はミニフィケーションや難読化に対応できない
export const handlerFactory = (
  requestHandler: RequestHandlerWithoutContext,
  errorHandler: ErrorHandler,
): RequestHandler => {
  return async (event, context) => {
    try {
      logger.addContext(context);
      logger.info(`Start ${requestHandler.name}`);
      const handlerResult = await requestHandler(event);
      logger.info(`End ${requestHandler.name}`);
      return handlerResult;
    } catch (e: unknown) {
      if (e instanceof AppError) {
        logger.error(`Error ${requestHandler.name}`, e);
        const errorResult = await errorHandler(e);
        logger.info(`Error response from ${errorHandler.name}`, {
          result: errorResult,
        });
        return errorResult;
      } else {
        logger.error(`Error ${requestHandler.name}`, new Error(String(e)));
        return httpResponse(500).withError(ErrorCode.UNKNOWN_ERROR);
      }
    }
  };
};
