import { AppError } from '../../../../src/common/errors/app-errors';
import { USER_ERROR_MESSAGES } from '../../../../src/common/errors/error-messsages';
import { httpErrorHandler } from '../../../../src/handlers/factory/http-error-handler';

describe('httpErrorHandler', () => {
  test.each`
    errorCode                      | expected_http_status_code | expected_user_error_message
    ${'TASK_NOT_FOUND'}            | ${404}                    | ${USER_ERROR_MESSAGES['TASK_NOT_FOUND']}
    ${'TASK_CONVERSION_ERROR'}     | ${500}                    | ${USER_ERROR_MESSAGES['TASK_CONVERSION_ERROR']}
    ${'TASK_UNKNOWN_ERROR'}        | ${500}                    | ${USER_ERROR_MESSAGES['TASK_UNKNOWN_ERROR']}
    ${'DDB_RESOURCE_NOT_FOUND'}    | ${404}                    | ${USER_ERROR_MESSAGES['DDB_RESOURCE_NOT_FOUND']}
    ${'DDB_THROUGHPUT_EXCEEDED'}   | ${429}                    | ${USER_ERROR_MESSAGES['DDB_THROUGHPUT_EXCEEDED']}
    ${'DDB_VALIDATION_ERROR'}      | ${400}                    | ${USER_ERROR_MESSAGES['DDB_VALIDATION_ERROR']}
    ${'DDB_INTERNAL_SERVER_ERROR'} | ${500}                    | ${USER_ERROR_MESSAGES['DDB_INTERNAL_SERVER_ERROR']}
    ${'UNKNOWN_ERROR'}             | ${500}                    | ${USER_ERROR_MESSAGES['UNKNOWN_ERROR']}
  `(
    'given an AppError with code $errorCode it should return a response with status $expected_http_status_code and message $expected_user_error_message',
    ({ errorCode, expected_http_status_code, expected_user_error_message }) => {
      const appError = new AppError(errorCode, 'Some detailed error message');
      const response = httpErrorHandler(appError);

      expect(response.statusCode).toBe(expected_http_status_code);
      expect(JSON.parse(response.body!)).toEqual({
        code: errorCode,
        message: expected_user_error_message,
      });
    },
  );
});
