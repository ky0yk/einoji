import { AppError } from '../../../../src/common/errors/app-errors';
import { httpErrorHandler } from '../../../../src/handlers/factory/http-error-handler';
import {
  USER_ERROR_MESSAGES,
  UserErrorCode,
} from '../../../../src/handlers/http/user-error-mapping';

describe('httpErrorHandler', () => {
  test.each`
    errorCode                      | expected_http_status_code | expected_user_error_message                  | expected_user_error_code
    ${'INVALID_REQUEST'}           | ${400}                    | ${USER_ERROR_MESSAGES['INVALID_REQUEST']}    | ${UserErrorCode.INVALID_REQUEST}
    ${'DDB_VALIDATION_ERROR'}      | ${400}                    | ${USER_ERROR_MESSAGES['INVALID_REQUEST']}    | ${UserErrorCode.INVALID_REQUEST}
    ${'TASK_NOT_FOUND'}            | ${404}                    | ${USER_ERROR_MESSAGES['TASK_NOT_AVAILABLE']} | ${UserErrorCode.TASK_NOT_AVAILABLE}
    ${'TASK_CONVERSION_ERROR'}     | ${500}                    | ${USER_ERROR_MESSAGES['SYSTEM_ERROR']}       | ${UserErrorCode.SYSTEM_ERROR}
    ${'TASK_UNKNOWN_ERROR'}        | ${500}                    | ${USER_ERROR_MESSAGES['SYSTEM_ERROR']}       | ${UserErrorCode.SYSTEM_ERROR}
    ${'DDB_RESOURCE_NOT_FOUND'}    | ${500}                    | ${USER_ERROR_MESSAGES['SYSTEM_ERROR']}       | ${UserErrorCode.SYSTEM_ERROR}
    ${'DDB_INTERNAL_SERVER_ERROR'} | ${500}                    | ${USER_ERROR_MESSAGES['SYSTEM_ERROR']}       | ${UserErrorCode.SYSTEM_ERROR}
    ${'UNKNOWN_ERROR'}             | ${500}                    | ${USER_ERROR_MESSAGES['SYSTEM_ERROR']}       | ${UserErrorCode.SYSTEM_ERROR}
    ${'DDB_THROUGHPUT_EXCEEDED'}   | ${503}                    | ${USER_ERROR_MESSAGES['SYSTEM_OVERLOAD']}    | ${UserErrorCode.SYSTEM_OVERLOAD}
  `(
    'given an AppError with code $errorCode it should return a response with status $expected_http_status_code, message $expected_user_error_message and user error code $expected_user_error_code',
    ({
      errorCode,
      expected_http_status_code,
      expected_user_error_message,
      expected_user_error_code,
    }) => {
      const appError = new AppError(errorCode, 'Some detailed error message');
      const response = httpErrorHandler(appError);

      expect(response.statusCode).toBe(expected_http_status_code);
      expect(JSON.parse(response.body!)).toEqual({
        code: expected_user_error_code,
        message: expected_user_error_message,
      });
    },
  );
});
