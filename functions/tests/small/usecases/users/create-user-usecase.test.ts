import { CreateUserData } from '../../../../src/domain/user/user';
import { userRepository } from '../../../../src/infrastructure/cognito/user-repository';
import { createUserUsecase } from '../../../../src/usecases/users/create-user-usecase';
import { AppError } from '../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';

jest.mock('../../../../src/infrastructure/cognito/user-repository');

describe('createUserUsecase', () => {
  beforeEach(() => {
    (userRepository.create as jest.Mock).mockClear();
  });

  const dummyCreateUserData: CreateUserData = {
    email: 'johndoe@example.com',
    password: 'P@ssword123',
  };

  const validUserId = 'valid-user-id';

  test('should create a user successfully', async () => {
    (userRepository.create as jest.Mock).mockResolvedValue(validUserId);

    const result = await createUserUsecase(dummyCreateUserData);

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(validUserId);
  });

  test('should throw AppError with INVALID_EMAIL_FORMAT if provided email is invalid', async () => {
    const invalidEmailUserData = {
      email: 'invalidEmail',
      password: 'P@ssword123',
    };

    const err = await createUserUsecase(invalidEmailUserData).catch((e) => e);

    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(ErrorCode.INVALID_EMAIL_FORMAT);
  });

  test('should throw AppError with INVALID_PASSWORD_FORMAT if provided password is invalid', async () => {
    const invalidPasswordUserData = {
      email: 'johndoe@example.com',
      password: 'password',
    };

    const err = await createUserUsecase(invalidPasswordUserData).catch(
      (e) => e,
    );

    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(ErrorCode.INVALID_PASSWORD_FORMAT);
  });
});
