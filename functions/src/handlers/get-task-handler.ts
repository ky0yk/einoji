import { APIGatewayEvent } from 'aws-lambda';
import { z } from 'zod';
import { httpResponse, LambdaResponse } from './http/http-response';

import { getTaskUseCase } from '../usecases/get-task-usecase';
import {
  handlerFactory,
  RequestHandlerWithoutContext,
} from './factory/handler-factory';
import { HttpStatus } from './http/http-status';
import { ErrorCode } from '../common/errors/error-codes';
import { AppError } from '../common/errors/app-errors';

export const EventSchema = z.object({
  pathParameters: z.object({ id: z.string().uuid() }),
});

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const eventResult = EventSchema.safeParse(event);

  if (!eventResult.success) {
    throw new AppError(ErrorCode.INVALID_REQUEST);
  }

  const { pathParameters } = eventResult.data;

  const task = await getTaskUseCase(pathParameters.id);
  return httpResponse(HttpStatus.OK).withBody(task);
};

export const handler = handlerFactory('getTask', requestHandler);
