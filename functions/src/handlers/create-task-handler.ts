import { APIGatewayEvent } from 'aws-lambda';
import { z } from 'zod';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from './factory/handler-factory';
import { HttpStatus, LambdaResponse, httpResponse } from './http/http-response';
import { ErrorCode } from '../common/error-codes';
import { createTaskUseCase } from '../usecases/create-task-usecase';
import { CreateTaskRequestSchema } from './request_schemas/create-task-request';

const EventSchema = z.object({
  body: z.string(),
});

const requestHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const eventResult = EventSchema.safeParse(event);
  console.log(eventResult);

  if (!eventResult.success) {
    return httpResponse(HttpStatus.BAD_REQUEST).withError(
      ErrorCode.INVALID_REQUEST,
    );
  }

  const body = eventResult.data.body;
  const bodyResult = CreateTaskRequestSchema.safeParse(JSON.parse(body));

  if (!bodyResult.success) {
    return httpResponse(HttpStatus.BAD_REQUEST).withError(
      ErrorCode.INVALID_REQUEST,
    );
  }

  const createdTask = await createTaskUseCase(bodyResult.data);

  return httpResponse(HttpStatus.CREATED).withBody(createdTask);
};

export const handler = handlerFactory('createTask', requestHandler);
