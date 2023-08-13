import { APIGatewayEvent } from 'aws-lambda';
import { z } from 'zod';
import {
  httpResponse,
  HttpStatus,
  LambdaResponse,
} from './utils/http-response';
import {
  ErrorHandler,
  RequestHandlerWithoutContext,
  handlerFactory,
} from './utils/handler-factory';
import { AppError, ClientError } from '../src/common/app-errors';
import { ErrorCode } from '../src/common/error-codes';
import { getTaskUseCase } from '../src/usecases/get-task-usecase';

export const EventSchema = z.object({
  pathParameters: z.object({ id: z.string().uuid() }),
});

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const eventResult = EventSchema.safeParse(event);

  if (!eventResult.success) {
    return httpResponse(HttpStatus.BAD_REQUEST).withError(
      ErrorCode.INVALID_REQUEST,
    );
  }

  const { pathParameters } = eventResult.data;

  const task = await getTaskUseCase(pathParameters.id);
  return httpResponse(HttpStatus.OK).withBody(task);
};

export const errorHandler: ErrorHandler = async (
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
    default:
      if (error instanceof ClientError) {
        return httpResponse(HttpStatus.BAD_REQUEST).withError(
          ErrorCode.INVALID_REQUEST,
        );
      } else {
        return httpResponse(HttpStatus.INTERNAL_SERVER_ERROR).withError(
          ErrorCode.INTERNAL_SERVER_ERROR,
        );
      }
  }
};

export const handler = handlerFactory(requestHandler, errorHandler);

export const _testExports = {
  requestHandler,
  errorHandler,
};
