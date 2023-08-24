import { APIGatewayEvent } from 'aws-lambda';
import { z } from 'zod';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from './factory/handler-factory';
import { createTaskUseCase } from '../usecases/create-task-usecase';
import { CreateTaskRequestSchema } from './request_schemas/create-task-request';
import { LambdaResponse, httpResponse } from './http/http-response';
import { HttpStatus } from './http/http-status';
import { ErrorCode } from '../common/errors/error-codes';
import { AppError } from '../common/errors/app-errors';

const EventSchema = z.object({
  body: z.string(),
});

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const eventResult = EventSchema.safeParse(event);

  if (!eventResult.success) {
    throw new AppError(ErrorCode.INVALID_REQUEST);
  }

  const body = eventResult.data.body;
  const bodyResult = CreateTaskRequestSchema.safeParse(JSON.parse(body));

  if (!bodyResult.success) {
    throw new AppError(ErrorCode.INVALID_REQUEST);
  }

  const createdTask = await createTaskUseCase(bodyResult.data);

  return httpResponse(HttpStatus.CREATED).withBody(createdTask);
};

export const handler = handlerFactory('createTask', requestHandler);
