import { Email } from '../../../domain/user/email';
import { Password } from '../../../domain/user/password';
import { RepositoryAction } from '../../base/contract/base-contracts';

export type CreateUserAction = RepositoryAction<string, [CreateUserPayload]>;
export type AuthUserAction = RepositoryAction<string, [AuthUserPayload]>;

export type UserRepository = {
  create: CreateUserAction;
  auth: AuthUserAction;
};

export type CreateUserPayload = {
  email: Email;
  password: Password;
};

export type AuthUserPayload = {
  email: Email;
  password: Password;
};
