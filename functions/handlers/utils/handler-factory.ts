import { APIGatewayEvent, Context } from 'aws-lambda';
import { logger } from '../../src/common/logger';
import { LambdaResponse } from './http-response';

export type RequestHandler = (
  event: APIGatewayEvent,
  context: Context,
) => Promise<LambdaResponse>;
export type ErrorHandler = (error: any) => Promise<LambdaResponse>;

// NOTE: 現状の動的に関数名を取得する方法はミニフィケーションや難読化に対応できない
export const handlerFactory = (
  requestHandler: RequestHandler,
  errorHandler: ErrorHandler,
): RequestHandler => {
  return async (event, context) => {
    try {
      logger.addContext(context);
      logger.info(`Start ${requestHandler.name}`);
      const handlerResult = await requestHandler(event, context);
      logger.info(`End ${requestHandler.name}`);
      return handlerResult;
    } catch (e: any) {
      logger.error(`Error ${requestHandler.name}`, e);
      const errorResult = await errorHandler(e);
      logger.info(`Error response from ${errorHandler.name}`, {
        result: errorResult,
      });
      return errorResult;
    }
  };
};
