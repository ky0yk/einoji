import { z } from 'zod';
import { UserInvalidEmailError } from './errors/user-errors';

/**
 * Eメールアドレスのローカル部（@の前の部分）
 * 1. 英数字及び特定の記号を一文字以上含むことができる
 * 2. ピリオド(.)によって区切られる複数の部分からなることができるが、連続するピリオドは許容されない
 */
const LOCAL_PART =
  "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*";

/**
 * Eメールアドレスのドメイン部（@の後の部分）
 * 1. 英数字で始まる必要がある
 * 2. ハイフン(-)や英数字を0文字以上含む部分が来ることができるが、ハイフンで終わることは許容されない
 * 3. ドット(.)で区切られる部分が複数存在することができる
 * 4. トップレベルドメイン（TLD）は、最後のピリオドの後の部分で、2文字以上である必要がある
 */
const DOMAIN_PART =
  '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9]){1,}';

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
