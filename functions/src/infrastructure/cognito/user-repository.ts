import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { cognitoFactory } from './factory/cognito-factory';
import {
  CreateUserAction,
  CreateUserPayload,
  UserRepository,
} from '../../usecases/users/contracts/user-repository-contract';
import { CognitoInternalError } from './errors/cognito-errors';

const CLIENT_ID = process.env.USER_POOL_CLIENTID;

const client = new CognitoIdentityProviderClient();

const create: CreateUserAction = async (
  payload: CreateUserPayload,
): Promise<string> => {
  const { email, password } = payload;
  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
  });

  const result = await client.send(command);
  if (!result.UserSub) {
    throw new CognitoInternalError(
      'Unexpected response received during user registration. email: ' + email,
    );
  }
  return result.UserSub;
};

export const userRepository: UserRepository = {
  create: cognitoFactory('createUser', create),
};
