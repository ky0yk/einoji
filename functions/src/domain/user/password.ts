import { z } from 'zod';
import { UserInvalidPasswordError } from './errors/user-errors';

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 64;

export const UPPERCASE_PATTERN = /[A-Z]/;
export const LOWERCASE_PATTERN = /[a-z]/;
export const NUMBER_PATTERN = /[0-9]/;
export const SPECIAL_CHAR_PATTERN = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

/*
 * パスワード要件:
 * 8文字以上64文字以下
 * 少なくとも1つの大文字を含む
 * 少なくとも1つの小文字を含む
 * 少なくとも1つの数字を含む
 * 少なくとも1つの特殊文字（記号）を含む
 */
const passwordSchema = z
  .string()
  .min(MIN_LENGTH, `Password must be at least ${MIN_LENGTH} characters long.`)
  .max(MAX_LENGTH, `Password must not exceed ${MAX_LENGTH} characters.`)
  .refine(
    (password) => UPPERCASE_PATTERN.test(password),
    'Password must contain at least one uppercase letter.',
  )
  .refine(
    (password) => LOWERCASE_PATTERN.test(password),
    'Password must contain at least one lowercase letter.',
  )
  .refine(
    (password) => NUMBER_PATTERN.test(password),
    'Password must contain at least one number.',
  )
  .refine(
    (password) => SPECIAL_CHAR_PATTERN.test(password),
    'Password must contain at least one special character.',
  );

export type Password = z.infer<typeof passwordSchema>;

export const toPassword = (password: string): Password => {
  const validationResult = passwordSchema.safeParse(password);

  if (!validationResult.success) {
    throw new UserInvalidPasswordError(
      'Invalid Password: ' + validationResult.error.issues[0]?.message,
    );
  }

  return password;
};
