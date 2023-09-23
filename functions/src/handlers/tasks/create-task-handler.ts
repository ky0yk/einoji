import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../factory/handler-factory';
import { createTaskUseCase } from '../../usecases/tasks/create-task-usecase';
import { CreateTaskRequestSchema } from './schemas/task-requests';
import { LambdaResponse, httpResponse } from '../http/http-response';
import { HttpStatus } from '../http/http-status';
import { validateBody } from '../http/validators';
import { CreateTaskData } from '../../domain/task';

const createTaskHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const data: CreateTaskData = validateBody(CreateTaskRequestSchema, event);

  const createdTask = await createTaskUseCase(data);

  return httpResponse(HttpStatus.CREATED, createdTask);
};

export const handler = handlerFactory('createTask', createTaskHandler);
