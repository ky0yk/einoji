import { Email } from './email';
import { Password } from './password';

export type CreateUserData = {
  email: Email;
  password: Password;
};
