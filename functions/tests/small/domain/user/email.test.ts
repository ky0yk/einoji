import { toEmail } from '../../../../src/domain/user/email';
import { UserInvalidEmailError } from '../../../../src/domain/user/errors/user-errors';

describe('toEmail', () => {
  test('should accept valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'test.test@example.com',
      'test.test+123@example.com',
      'test_test@example.co.jp',
    ];

    validEmails.forEach((email) => {
      expect(() => toEmail(email)).not.toThrow();
      expect(toEmail(email)).toEqual(email);
    });
  });

  test('should reject invalid email addresses', () => {
    const invalidEmails = [
      'test', // @がない
      'test@.com', // ドメインの最初が不正
      'test@test..com', // ドメイン内の連続したドット
      '.test@test.com', // ローカル部の最初がドット
      'test.@test.com', // ローカル部の最後がドット
      'te..st@test.com', // ローカル部の中に連続したドット
      'test@test.c', // TLDが短すぎる
      'test@-test.com', // ドメインの最初がハイフン
      'test@test-.com', // ドメインの最後がハイフン
      'test@test#.com', // ドメインに無効な文字
    ];

    invalidEmails.forEach((email) => {
      expect(() => toEmail(email)).toThrow(UserInvalidEmailError);
    });
  });

  test('should reject emails longer than 256 characters', () => {
    const tooLong = 'a'.repeat(64) + '@' + 'b'.repeat(190) + '.com'; // 257 characters total

    expect(() => toEmail(tooLong)).toThrow(UserInvalidEmailError);
  });
});
