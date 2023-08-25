import { AppError } from '../../../../src/common/errors/app-errors';
import { httpErrorHandler } from '../../../../src/handlers/factory/http-error-handler';
import {
  ERROR_RESPONSE_MAP,
  UserErrorCode,
} from '../../../../src/handlers/http/error-response-map';

describe('httpErrorHandler', () => {
  test.each`
    errorCode                      | expected_http_status_code | expected_user_error_message                                | expected_user_error_code
    ${'TASK_NOT_FOUND'}            | ${404}                    | ${ERROR_RESPONSE_MAP['TASK_NOT_FOUND'].message}            | ${UserErrorCode.TASK_NOT_AVAILABLE}
    ${'TASK_CONVERSION_ERROR'}     | ${500}                    | ${ERROR_RESPONSE_MAP['TASK_CONVERSION_ERROR'].message}     | ${UserErrorCode.TASK_PROCESS_ERROR}
    ${'TASK_UNKNOWN_ERROR'}        | ${500}                    | ${ERROR_RESPONSE_MAP['TASK_UNKNOWN_ERROR'].message}        | ${UserErrorCode.UNKNOWN_ERROR}
    ${'DDB_RESOURCE_NOT_FOUND'}    | ${404}                    | ${ERROR_RESPONSE_MAP['DDB_RESOURCE_NOT_FOUND'].message}    | ${UserErrorCode.RESOURCE_NOT_FOUND}
    ${'DDB_THROUGHPUT_EXCEEDED'}   | ${429}                    | ${ERROR_RESPONSE_MAP['DDB_THROUGHPUT_EXCEEDED'].message}   | ${UserErrorCode.SYSTEM_OVERLOAD}
    ${'DDB_VALIDATION_ERROR'}      | ${400}                    | ${ERROR_RESPONSE_MAP['DDB_VALIDATION_ERROR'].message}      | ${UserErrorCode.INVALID_REQUEST}
    ${'DDB_INTERNAL_SERVER_ERROR'} | ${500}                    | ${ERROR_RESPONSE_MAP['DDB_INTERNAL_SERVER_ERROR'].message} | ${UserErrorCode.SYSTEM_ERROR}
    ${'UNKNOWN_ERROR'}             | ${500}                    | ${ERROR_RESPONSE_MAP['UNKNOWN_ERROR'].message}             | ${UserErrorCode.UNKNOWN_ERROR}
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
