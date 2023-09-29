import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { mockClient } from 'aws-sdk-client-mock';
import { userRepository } from '../../../../src/infrastructure/cognito/user-repository';
import {
  UserAliasExistsError,
  UserNotFoundError,
} from '../../../../src/infrastructure/cognito/errors/cognito-errors';

const USER_POOL_CLIENTID = process.env.USER_POOL_CLIENTID;

const cognitoMockClient = mockClient(CognitoIdentityProviderClient);

describe('userRepository.create', () => {
  afterEach(() => {
    cognitoMockClient.reset();
  });

  test('should return UserSub when creating a user with valid email and password', async () => {
    const dummyPayload = { email: 'test@example.com', password: 'password123' };
    const dummyUserSub = 'dummyUserSubValue';
    cognitoMockClient.on(SignUpCommand).resolves({ UserSub: dummyUserSub });

    const returnedUserSub = await userRepository.create(dummyPayload);

    expect(returnedUserSub).toEqual(dummyUserSub);

    const callsOfSignUp = cognitoMockClient.commandCalls(SignUpCommand);
    expect(callsOfSignUp).toHaveLength(1);
    expect(callsOfSignUp[0].args[0].input).toEqual({
      ClientId: USER_POOL_CLIENTID,
      Username: dummyPayload.email,
      Password: dummyPayload.password,
    });
  });

  test('should throw UserNotFoundError when UserSub is not returned from Cognito', async () => {
    const dummyPayload = { email: 'test@example.com', password: 'password123' };
    cognitoMockClient.on(SignUpCommand).resolves({ UserSub: undefined });

    await expect(userRepository.create(dummyPayload)).rejects.toThrow(
      UserNotFoundError,
    );
  });

  test('should throw UserAliasExistsError when Cognito returns an AliasExistsException', async () => {
    const dummyPayload = { email: 'test@example.com', password: 'password123' };
    const dummyError = new Error('Alias exists');
    dummyError.name = 'AliasExistsException';
    cognitoMockClient.on(SignUpCommand).rejects(dummyError);

    await expect(userRepository.create(dummyPayload)).rejects.toThrow(
      UserAliasExistsError,
    );
  });
});
