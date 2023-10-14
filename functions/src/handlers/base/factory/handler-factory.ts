import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { logger } from '../../../utils/logger';
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
  logWrapper(name, 'ENTRY');
  const result = await fn(event);
  logWrapper(name, 'EXIT');
  return result;
};

const handleKnownError = (
  name: string,
  errorHandler: RequestErrorHandler,
  error: AppError,
): LambdaResponse => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = errorHandler(error);
  logWrapper(name, 'EXIT');
  return result;
};

const handlerUnknownError = (name: string, error: unknown): LambdaResponse => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = httpErrorResponse(
    new AppError(ErrorCode.UNKNOWN_ERROR, 'An unexpected error'),
  );
  logErrorWrapper(name, 'EXIT');
  return result;
};

const logWrapper = (name: string, action: string) =>
  logger.info(`${action} handler: ${name}`);
const logErrorWrapper = (name: string, action: string, error?: unknown) =>
  logger.error(`${action} error in handler: ${name}`, String(error));
