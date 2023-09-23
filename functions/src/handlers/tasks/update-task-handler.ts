import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../factory/handler-factory';
import { LambdaResponse, httpResponse } from '../http/http-response';
import { validateBodyAndPathParams } from '../http/validators';
import {
  TaskIdPathParamsSchema,
  UpdateTaskRequestSchema,
} from './schemas/task-requests';
import { HttpStatus } from '../http/http-status';
import { updateTaskUsecase } from '../../usecases/tasks/update-task-usecase';

const updateTaskHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const {
    body: updateTaskData,
    pathParameters: { id: taskId },
  } = validateBodyAndPathParams(
    event,
    UpdateTaskRequestSchema,
    TaskIdPathParamsSchema,
  );

  const updatedTask = await updateTaskUsecase(taskId, updateTaskData);

  return httpResponse(HttpStatus.OK, updatedTask);
};

export const handler = handlerFactory('updateTask', updateTaskHandler);
