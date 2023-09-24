import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  CreateUserAction,
  CreateUserPayload,
  UserRepository,
} from '../../usecases/users/contracts/user-repository-contract';
import { cognitoFactory } from './factory/cognito-factory';

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

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
    throw new Error('UserSub is undefined');
  }
  return result.UserSub;
};

export const userRepository: UserRepository = {
  create: cognitoFactory('createUser', create),
};
