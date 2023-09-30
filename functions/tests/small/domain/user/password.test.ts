import {
  toPassword,
  MAX_LENGTH,
  MIN_LENGTH,
} from '../../../../src/domain/user/password';
import { UserInvalidPasswordError } from '../../../../src/domain/user/errors/user-errors';

describe('toPassword', () => {
  test('should accept valid passwords', () => {
    const validPasswords = ['Password1!', 'P@ssw0rd123', '!@Aa345678'];

    validPasswords.forEach((password) => {
      expect(() => toPassword(password)).not.toThrow();
      expect(toPassword(password)).toEqual(password);
    });
  });

  test('should reject invalid passwords', () => {
    const invalidPasswords = [
      'password', // 小文字のみ
      'PASSWORD', // 大文字のみ
      '12345678', // 数字のみ
      '!@#$%^&*', // 特殊文字のみ
      'Pass', // 短すぎる
      'p1!', // 短すぎる
      'password1', // 大文字と特殊文字がない
      'PASSWORD1!', // 小文字がない
      'Password!', // 数字がない
    ];

    invalidPasswords.forEach((password) => {
      expect(() => toPassword(password)).toThrow(UserInvalidPasswordError);
    });
  });

  test('should reject passwords shorter than MIN_LENGTH or longer than MAX_LENGTH', () => {
    const BASE_VALID_PASSWORD = 'Aa1!'; // 必要な文字種が全て含む

    const tooShort =
      BASE_VALID_PASSWORD +
      'a'.repeat(MIN_LENGTH - BASE_VALID_PASSWORD.length - 1);

    const tooLong =
      BASE_VALID_PASSWORD +
      'a'.repeat(MAX_LENGTH - BASE_VALID_PASSWORD.length + 1);

    expect(() => toPassword(tooShort)).toThrow(UserInvalidPasswordError);
    expect(() => toPassword(tooLong)).toThrow(UserInvalidPasswordError);
  });
});
