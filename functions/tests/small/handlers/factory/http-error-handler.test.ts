import { AppError } from '../../../../src/common/errors/app-errors';
import { ErrorCode } from '../../../../src/common/errors/error-codes';
import { httpErrorHandler } from '../../../../src/handlers/factory/http-error-handler';

describe('httpErrorHandler', () => {
  test.each`
    errorCode                              | expected_http_status_code
    ${ErrorCode.INVALID_PAYLOAD_FORMAT}    | ${400}
    ${ErrorCode.INVALID_PAYLOAD_VALUE}     | ${422}
    ${ErrorCode.TASK_NOT_FOUND}            | ${404}
    ${ErrorCode.MALFORMED_DATA}            | ${500}
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
