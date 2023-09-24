import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../base/factory/handler-factory';

import {
  TaskIdPathParamsSchema,
  UpdateTaskRequestSchema,
} from './schemas/task-requests';
import { updateTaskUsecase } from '../../usecases/tasks/update-task-usecase';
import { LambdaResponse, httpResponse } from '../base/http/http-response';
import { validateBodyAndPathParams } from '../base/http/validators';
import { HttpStatus } from '../base/http/http-status';

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
