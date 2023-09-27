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
import { UserNotFoundError } from './errors/cognito-errors';

const CLIENT_ID = process.env.USER_POOL_CLIENTID;

const client = new CognitoIdentityProviderClient();

const create: CreateUserAction = async (
  paylod: CreateUserPayload,
): Promise<string> => {
  const { email, password } = paylod;
  const command = new SignUpCommand({
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
  });

  const result = await client.send(command);
  if (!result.UserSub) {
    throw new UserNotFoundError('User not found');
  }
  return result.UserSub;
};

export const userRepository: UserRepository = {
  create: cognitoFactory('createUser', create),
};
