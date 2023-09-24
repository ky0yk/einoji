import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../base/factory/handler-factory';
import { LambdaResponse, httpResponse } from '../http/http-response';
import { validatePathParams } from '../http/validators';
import { TaskIdPathParamsSchema } from './schemas/task-requests';
import { HttpStatus } from '../http/http-status';
import { getTaskUseCase } from '../../usecases/tasks/get-task-usecase';

const getTaskHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const { id: taskId } = validatePathParams(TaskIdPathParamsSchema, event);

  const task = await getTaskUseCase(taskId);
  return httpResponse(HttpStatus.OK, task);
};

export const handler = handlerFactory('getTask', getTaskHandler);
