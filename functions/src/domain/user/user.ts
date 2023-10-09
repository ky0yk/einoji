import { Email } from './email';
import { Password } from './password';

export type CreateUserData = {
  email: Email;
  password: Password;
};

export type AuthUserData = {
  email: Email;
  password: Password;
};
