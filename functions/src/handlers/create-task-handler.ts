import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from './factory/handler-factory';
import { createTaskUseCase } from '../usecases/create-task-usecase';
import { CreateTaskRequestSchema } from './http/requestSchemas/task-requests';
import { LambdaResponse, httpResponse } from './http/http-response';
import { HttpStatus } from './http/http-status';
import { validateBody, validateEvent } from './http/validators';

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const validEvent = validateEvent(event);
  const validBody = validateBody(CreateTaskRequestSchema, validEvent.body);

  const createdTask = await createTaskUseCase(validBody);

  return httpResponse(HttpStatus.CREATED).withBody(createdTask);
};

export const handler = handlerFactory('createTask', requestHandler);
