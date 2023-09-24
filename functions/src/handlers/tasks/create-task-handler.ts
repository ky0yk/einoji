import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../base/factory/handler-factory';
import { createTaskUseCase } from '../../usecases/tasks/create-task-usecase';
import { CreateTaskRequestSchema } from './schemas/task-requests';
import { CreateTaskData } from '../../domain/task/task';
import { LambdaResponse, httpResponse } from '../base/http/http-response';
import { validateBody } from '../base/http/validators';
import { HttpStatus } from '../base/http/http-status';

const createTaskHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const data: CreateTaskData = validateBody(CreateTaskRequestSchema, event);

  const createdTask = await createTaskUseCase(data);

  return httpResponse(HttpStatus.CREATED, createdTask);
};

export const handler = handlerFactory('createTask', createTaskHandler);
