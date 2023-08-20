import { ClientError, ServerError } from '../../../../src/common/app-errors';
import { ERROR_MESSAGES, ErrorCode } from '../../../../src/common/error-codes';
import { httpErrorHandler } from '../../../../src/handlers/factory/http-error-handler';
import { HttpStatus } from '../../../../src/handlers/http/http-response';

describe('httpErrorHandler', () => {
  test.each`
    error_instance                                  | expected_status                     | expected_error_code
    ${new ServerError(ErrorCode.TASK_NOT_FOUND)}    | ${HttpStatus.NOT_FOUND}             | ${ErrorCode.TASK_NOT_FOUND}
    ${new ServerError(ErrorCode.DDB_CLIENT_ERROR)}  | ${HttpStatus.BAD_REQUEST}           | ${ErrorCode.DDB_CLIENT_ERROR}
    ${new ServerError(ErrorCode.DDB_SERVER_ERROR)}  | ${HttpStatus.INTERNAL_SERVER_ERROR} | ${ErrorCode.DDB_SERVER_ERROR}
    ${new ServerError(ErrorCode.DDB_UNKNOWN_ERROR)} | ${HttpStatus.INTERNAL_SERVER_ERROR} | ${ErrorCode.DDB_UNKNOWN_ERROR}
    ${new ServerError(ErrorCode.UNKNOWN_ERROR)}     | ${HttpStatus.INTERNAL_SERVER_ERROR} | ${ErrorCode.UNKNOWN_ERROR}
    ${new ClientError(ErrorCode.UNKNOWN_ERROR)}     | ${HttpStatus.BAD_REQUEST}           | ${ErrorCode.INVALID_REQUEST}
  `(
    'returns $expected_status and error code $expected_error_code for error $error_instance',
    async ({ error_instance, expected_status, expected_error_code }) => {
      const response = await httpErrorHandler(error_instance);

      expect(response.statusCode).toBe(expected_status);

      const responseBody = JSON.parse(response.body || '{}');
      expect(responseBody.errorCode).toBe(expected_error_code);
      expect(responseBody.message).toBe(
        ERROR_MESSAGES[expected_error_code as ErrorCode],
      );
    },
  );
});
