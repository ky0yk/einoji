import { AuthUserData } from '../../../../src/domain/user/user';
import { userRepository } from '../../../../src/infrastructure/cognito/user-repository';
import { authUserUsecase } from '../../../../src/usecases/users/auth-user-usecase';

jest.mock('../../../../src/infrastructure/cognito/user-repository');

describe('authUserUsecase', () => {
  beforeEach(() => {
    (userRepository.auth as jest.Mock).mockClear();
  });

  const dummyAuthUserData: AuthUserData = {
    email: 'johndoe@example.com',
    password: 'P@ssword123',
  };

  const validAccessToken = 'valid-access-token';

  test('should authenticate a user successfully', async () => {
    (userRepository.auth as jest.Mock).mockResolvedValue(validAccessToken);

    const result = await authUserUsecase(dummyAuthUserData);

    expect(userRepository.auth).toHaveBeenCalledTimes(1);
    expect(result).toBe(validAccessToken);
  });
});
