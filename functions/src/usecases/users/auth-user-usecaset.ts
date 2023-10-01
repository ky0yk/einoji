import { toEmail } from '../../domain/user/email';
import { toPassword } from '../../domain/user/password';
import { AuthUserData } from '../../domain/user/user';
import { userRepository } from '../../infrastructure/cognito/user-repository';
import { userUseCaseFactory } from './factory/user-usecase-factory';

const authUser = async (data: AuthUserData): Promise<string> => {
  const email = toEmail(data.email);
  const password = toPassword(data.password);

  const token = await userRepository.auth({ email, password });

  return token;
};

export const authUserUsecase = userUseCaseFactory('authUser', authUser);
