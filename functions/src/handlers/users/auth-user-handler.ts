import { APIGatewayEvent } from 'aws-lambda';
import {
  RequestHandlerWithoutContext,
  handlerFactory,
} from '../base/factory/handler-factory';
import { validateBody } from '../base/http/validators';
import { httpResponse } from '../base/http/http-response';
import { HttpStatus } from '../base/http/http-status';
import { authUserUsecase } from '../../usecases/users/auth-user-usecase';
import { AuthUserRequestSchema } from './schemas/user-requests';

const authUserHandler: RequestHandlerWithoutContext = async (
  event: APIGatewayEvent,
) => {
  const data = validateBody(AuthUserRequestSchema, event);
  const token = await authUserUsecase(data);
  return httpResponse(HttpStatus.OK, { token: token });
};

export const handler = handlerFactory('authUser', authUserHandler);
