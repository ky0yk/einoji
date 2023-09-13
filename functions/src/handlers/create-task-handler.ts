import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from './factory/handler-factory';
import { createTaskUseCase } from '../usecases/create-task-usecase';
import { LambdaResponse, httpResponse } from './http/http-response';
import { HttpStatus } from './http/http-status';
import { validateBody } from './http/validators';
import { CreateTaskData } from '../domain/task';
import { CreateTaskRequestSchema } from './schemas/task-requests';

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const data: CreateTaskData = validateBody(CreateTaskRequestSchema, event);

  const createdTask = await createTaskUseCase(data);

  return httpResponse(HttpStatus.CREATED).withBody(createdTask);
};

export const handler = handlerFactory('createTask', requestHandler);
