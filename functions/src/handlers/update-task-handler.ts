import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from './factory/handler-factory';
import { LambdaResponse, httpResponse } from './http/http-response';
import { HttpStatus } from './http/http-status';
import {
  TaskIdPathParamsSchema,
  UpdateTaskRequestSchema,
} from './schemas/task-requests';
import { updateTaskUsecase } from '../usecases/update-task-usecase';
import { validateBodyAndPathParams } from './http/validators';

const requestHandler: RequestHandlerWithoutContext = async (
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

  return httpResponse(HttpStatus.OK).withBody(updatedTask);
};

export const handler = handlerFactory('updateTask', requestHandler);
