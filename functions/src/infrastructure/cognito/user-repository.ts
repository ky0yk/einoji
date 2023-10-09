import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { cognitoFactory } from './factory/cognito-factory';
import {
  AuthUserAction,
  AuthUserPayload,
  CreateUserAction,
  CreateUserPayload,
  UserRepository,
} from '../../usecases/users/contracts/user-repository-contract';
import {
  AuthenticationError,
  CognitoInternalError,
} from './errors/cognito-errors';

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

const auth: AuthUserAction = async (
  payload: AuthUserPayload,
): Promise<string> => {
  const { email, password } = payload;
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });
  const result = await client.send(command);
  if (!result.AuthenticationResult?.IdToken) {
    throw new AuthenticationError(
      'Failed to retrieve an access token during user authentication. Please check your credentials and try again.',
    );
  }
  return result.AuthenticationResult.IdToken;
};

export const userRepository: UserRepository = {
  create: cognitoFactory('createUser', create),
  auth: cognitoFactory('authUser', auth),
};
