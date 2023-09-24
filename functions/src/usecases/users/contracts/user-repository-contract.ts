import { Email } from '../../../domain/user/email';
import { Password } from '../../../domain/user/password';
import { RepositoryAction } from '../../base/contracts/base-contracts';

export type CreateUserAction = RepositoryAction<string, [CreateUserPayload]>;

export type UserRepository = {
  create: CreateUserAction;
};

export type CreateUserPayload = {
  email: Email;
  password: Password;
};
