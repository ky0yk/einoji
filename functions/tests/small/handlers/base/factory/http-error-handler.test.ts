import { httpErrorHandler } from '../../../../../src/handlers/base/factory/http-error-handler';
import { AppError } from '../../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../../src/utils/errors/error-codes';

describe('httpErrorHandler', () => {
  test.each`
    errorCode                              | expected_http_status_code
    // 400
    ${ErrorCode.INVALID_PAYLOAD_FORMAT}    | ${400}
    ${ErrorCode.INVALID_QUERY_PARAMETER}   | ${400}
    ${ErrorCode.INVALID_PATH_PARAMETER}    | ${400}
    ${ErrorCode.INVALID_CREDENTIALS}       | ${401}
    ${ErrorCode.USER_NOT_CONFIRMED}        | ${403}
    ${ErrorCode.TASK_NOT_FOUND}            | ${404}
    ${ErrorCode.USER_NOT_FOUND}            | ${404}
    ${ErrorCode.USER_EMAIL_EXISTS}         | ${409}
    ${ErrorCode.INVALID_PAYLOAD_VALUE}     | ${422}
    ${ErrorCode.TASK_UPDATE_RULE_ERROR}    | ${422}
    ${ErrorCode.INVALID_PASSWORD_FORMAT}   | ${422}
    ${ErrorCode.INVALID_EMAIL_FORMAT}      | ${422}
    ${ErrorCode.DATABASE_CONNECTION_ERROR} | ${500}
    ${ErrorCode.UNKNOWN_ERROR}             | ${500}
    ${ErrorCode.SERVICE_DOWNTIME}          | ${503}
    ${ErrorCode.EXTERNAL_SERVICE_FAILURE}  | ${503}
  `(
    'given an AppError with code $errorCode it should return a response with status $expected_http_status_code',
    ({ errorCode, expected_http_status_code }) => {
      const appError = new AppError(errorCode, 'Some detailed error message');
      const response = httpErrorHandler(appError);

      expect(response.statusCode).toBe(expected_http_status_code);
    },
  );
});
