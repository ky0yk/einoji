import { APIGatewayEvent } from 'aws-lambda';
import { z } from 'zod';
import { httpResponse, HttpStatus, LambdaResponse } from './http/http-response';

import { ErrorCode } from '../common/error-codes';
import { getTaskUseCase } from '../usecases/get-task-usecase';
import {
  handlerFactory,
  RequestHandlerWithoutContext,
} from './factory/handler-factory';

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

export const handler = handlerFactory('getTask', requestHandler);
