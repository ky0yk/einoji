import { APIGatewayEvent } from 'aws-lambda';
import { createUserUsecase } from '../../usecases/users/create-user-usecase';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../base/factory/handler-factory';
import { LambdaResponse, httpResponse } from '../base/http/http-response';
import { HttpStatus } from '../base/http/http-status';
import { validateBody } from '../base/http/validators';
import { CreateUserRequestSchema } from './schemas/user-requests';
import { CreateUserData } from '../../domain/user/user';

const createUserHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
): Promise<LambdaResponse> => {
  const data: CreateUserData = validateBody(CreateUserRequestSchema, event);

  const createdUser = await createUserUsecase(data);

  return httpResponse(HttpStatus.CREATED, createdUser);
};

export const handler = handlerFactory('createUser', createUserHandler);
