import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from './factory/handler-factory';
import { LambdaResponse, httpResponse } from './http/http-response';
import { validatePathParams } from './http/validators';
import { TaskIdPathParamsSchema } from './schemas/task-requests';
import { HttpStatus } from './http/http-status';
import { deleteTaskUseCase } from '../usecases/delete-task-usecase';

const deleteTaskHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const { id: taskId } = validatePathParams(TaskIdPathParamsSchema, event);
  await deleteTaskUseCase(taskId);
  return httpResponse(HttpStatus.NO_CONTENT);
};

export const handler = handlerFactory('deleteTask', deleteTaskHandler);
