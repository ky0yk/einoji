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

const logWrapper = (name: string, action: string) =>
  logger.info(`${action} handler: ${name}`);
const logErrorWrapper = (name: string, action: string, error?: unknown) =>
  logger.error(`${action} error in handler: ${name}`, String(error));

const execute = async <T = APIGatewayProxyEvent>(
  name: string,
  fn: RequestHandlerWithoutContext<T>,
  event: T,
) => {
  logWrapper(name, 'ENTRY');
  const result = await fn(event);
  logWrapper(name, 'EXIT');
  return result;
};

const handleAppError = async (
  name: string,
  errorHandler: RequestErrorHandler,
  error: AppError,
) => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = errorHandler(error);
  logWrapper(name, 'EXIT');
  return result;
};

const handleOtherError = (name: string, error: unknown) => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = httpErrorResponse(
    new AppError(ErrorCode.UNKNOWN_ERROR, 'An unexpected error'),
  );
  logErrorWrapper(name, 'EXIT');
  return result;
};

export const handlerFactory =
  <T = APIGatewayProxyEvent>(
    name: string,
    requestHandler: RequestHandlerWithoutContext<T>,
    errorHandler: RequestErrorHandler = httpErrorHandler,
  ): RequestHandler<T> =>
  async (event, context): Promise<LambdaResponse> => {
    try {
      logger.addContext(context);
      return await execute(name, requestHandler, event);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return await handleAppError(name, errorHandler, error);
      }
      return handleOtherError(name, error);
    }
  };
