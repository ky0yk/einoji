import { toEmail } from '../../domain/user/email';
import { toPassword } from '../../domain/user/password';
import { CreateUserData } from '../../domain/user/user';
import { userRepository } from '../../infrastructure/cognito/user-repository';
import { userUseCaseFactory } from './factory/user-usecase-factory';

const createUser = async (data: CreateUserData): Promise<string> => {
  const password = toPassword(data.password);
  const email = toEmail(data.email);

  return await userRepository.create({ email, password });
};

export const createUserUsecase = userUseCaseFactory('createUser', createUser);
