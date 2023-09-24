import { z } from 'zod';
import { UserInvalidEmailError } from './errors/user-errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailSchema = z
  .string()
  .refine((email) => EMAIL_PATTERN.test(email), 'Invalid Email');

export type Email = z.infer<typeof EmailSchema>;

export const toEmail = (email: string): Email => {
  const validationResult = EmailSchema.safeParse(email);

  if (!validationResult.success) {
    throw new UserInvalidEmailError(validationResult.error.issues[0]?.message);
  }

  return email;
};
