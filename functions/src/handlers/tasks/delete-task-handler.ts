import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../base/factory/handler-factory';
import { TaskIdPathParamsSchema } from './schemas/task-requests';
import { deleteTaskUseCase } from '../../usecases/tasks/delete-task-usecase';
import { HttpStatus } from '../base/http/http-status';
import { LambdaResponse, httpResponse } from '../base/http/http-response';
import { validatePathParams } from '../base/http/validators';

const deleteTaskHandler: RequestHandlerWithoutContext = async (
  event,
): Promise<LambdaResponse> => {
  const userId: string = event.requestContext.authorizer?.claims.sub;
  const { id: taskId } = validatePathParams(TaskIdPathParamsSchema, event);
  await deleteTaskUseCase(userId, taskId);
  return httpResponse(HttpStatus.NO_CONTENT);
};

export const handler = handlerFactory('deleteTask', deleteTaskHandler);
