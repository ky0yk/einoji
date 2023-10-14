import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { createLoggerFunctionsForLayer, logger } from '../../../utils/logger';
import { AppError } from '../../../utils/errors/app-errors';
import { ErrorCode } from '../../../utils/errors/error-codes';
import { LambdaResponse, httpErrorResponse } from '../http/http-response';
import { httpErrorHandler } from './http-error-handler';

export type RequestHandler<T = APIGatewayProxyEvent> = (
  event: T,
  context: Context,
) => Promise<LambdaResponse>;

export type RequestHandlerWithoutContext<T = APIGatewayProxyEvent> = (
  event: T,
) => Promise<LambdaResponse>;

export type RequestErrorHandler = (error: AppError) => LambdaResponse;

const { log, logError } = createLoggerFunctionsForLayer('HANDLER');

export const handlerFactory =
  <T = APIGatewayProxyEvent>(
    name: string,
    requestHandler: RequestHandlerWithoutContext<T>,
    errorHandler: RequestErrorHandler = httpErrorHandler,
  ): RequestHandler<T> =>
  async (event, context): Promise<LambdaResponse> => {
    try {
      logger.addContext(context);
      return await handleRequest(name, requestHandler, event);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return handleKnownError(name, errorHandler, error);
      }
      return handlerUnknownError(name, error);
    }
  };

const handleRequest = async <T = APIGatewayProxyEvent>(
  name: string,
  fn: RequestHandlerWithoutContext<T>,
  event: T,
): Promise<LambdaResponse> => {
  log('ENTRY', name);
  const result = await fn(event);
  logError('ENTRY', name);
  return result;
};

const handleKnownError = (
  name: string,
  errorHandler: RequestErrorHandler,
  error: AppError,
): LambdaResponse => {
  logError('ENTRY', name, error);
  const result = errorHandler(error);
  log('ENTRY', name);
  return result;
};

const handlerUnknownError = (name: string, error: unknown): LambdaResponse => {
  logError('ENTRY', name, error);
  const result = httpErrorResponse(
    new AppError(ErrorCode.UNKNOWN_ERROR, 'An unexpected error'),
  );
  logError('ENTRY', name);
  return result;
};
