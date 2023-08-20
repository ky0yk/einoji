import {
  DdbClientError,
  DdbServerError,
  DdbUnknownError,
} from '../../../../../src/infrastructure/ddb/errors/ddb-errors';
import { ddbErrorHandler } from '../../../../../src/infrastructure/ddb/factory/ddb-error-handler';

describe('ddbErrorHandler', () => {
  test.each`
    error_instance                            | expected_thrown_error
    ${new DdbClientError('ddb client error')} | ${DdbClientError}
    ${new DdbServerError('ddb server error')} | ${DdbServerError}
    ${new Error('ddb other error')}           | ${DdbUnknownError}
  `(
    'throws correct error for $error_instance.name',
    ({ error_instance, expected_thrown_error }) => {
      expect(() => ddbErrorHandler(error_instance)).toThrow(
        expected_thrown_error,
      );
    },
  );
});
