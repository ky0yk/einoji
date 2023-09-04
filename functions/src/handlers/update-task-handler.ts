import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from './factory/handler-factory';
import { LambdaResponse, httpResponse } from './http/http-response';
import { HttpStatus } from './http/http-status';
import {
  validateBody,
  validateEvent,
  validateEventPathParameters,
} from './http/validators';
import { UpdateTaskRequestSchema } from './http/requestSchemas/task-requests';
import { updateTaskUsecase } from '../usecases/update-task-usecase';

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const validEvent = validateEvent(event);
  const validBody = validateBody(UpdateTaskRequestSchema, validEvent.body);
  const taskId = validateEventPathParameters(event).pathParameters.id;

  const updatedTask = await updateTaskUsecase(taskId, validBody);

  return httpResponse(HttpStatus.OK).withBody(updatedTask);
};

export const handler = handlerFactory('updateTask', requestHandler);
