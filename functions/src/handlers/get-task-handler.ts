import { APIGatewayEvent } from 'aws-lambda';
import { httpResponse, LambdaResponse } from './http/http-response';

import { getTaskUseCase } from '../usecases/get-task-usecase';
import {
  handlerFactory,
  RequestHandlerWithoutContext,
} from './factory/handler-factory';
import { HttpStatus } from './http/http-status';
import { validatePathParams } from './http/validators';
import { TaskIdPathParamsSchema } from './schemas/task-requests';

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const { id: taskId } = validatePathParams(TaskIdPathParamsSchema, event);

  const task = await getTaskUseCase(taskId);
  return httpResponse(HttpStatus.OK, task);
};

export const handler = handlerFactory('getTask', requestHandler);
