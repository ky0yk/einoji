import { z } from 'zod';
import { UserInvalidEmailError } from './errors/user-errors';

// ユーザー名部分（ローカル部）の正規表現
const LOCAL_PART =
  "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*";

// ドメイン名部分の正規表現を調整
// ここで、最後の部分は2文字以上のTLDを示す
const DOMAIN_PART =
  '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)*(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9]))';

// 一般的なメールアドレスの正規表現を組み立て
const EMAIL_PATTERN = new RegExp(`^${LOCAL_PART}@${DOMAIN_PART}$`);

const EmailSchema = z
  .string()
  .max(256, 'Email too long') // メールアドレス全体の最大長は256文字（@を含む）
  .refine((email) => EMAIL_PATTERN.test(email), 'Invalid Email');

export type Email = z.infer<typeof EmailSchema>;

export const toEmail = (email: string): Email => {
  const validationResult = EmailSchema.safeParse(email);

  if (!validationResult.success) {
    throw new UserInvalidEmailError(validationResult.error.issues[0]?.message);
  }

  return email;
};
