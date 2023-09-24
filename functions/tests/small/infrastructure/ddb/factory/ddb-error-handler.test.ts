import {
  DdbInternalServerError,
  DdbProvisionedThroughputExceededError,
  DdbResourceNotFoundError,
  DdbValidationError,
} from '../../../../../src/infrastructure/ddb/errors/ddb-errors';
import { ddbErrorHandler } from '../../../../../src/infrastructure/ddb/factory/ddb-error-handler';

describe('ddbErrorHandler', () => {
  test.each`
    original_error_name                         | expected_error_class
    ${'ResourceNotFoundException'}              | ${DdbResourceNotFoundError}
    ${'ProvisionedThroughputExceededException'} | ${DdbProvisionedThroughputExceededError}
    ${'ValidationException'}                    | ${DdbValidationError}
    ${'SomeUnknownException'}                   | ${DdbInternalServerError}
  `(
    'given an error with name $original_error_name it should return an instance of $expected_error_class',
    ({ original_error_name, expected_error_class }) => {
      const originalError = new Error('Dummy error message');
      originalError.name = original_error_name;

      const returnedError = ddbErrorHandler(originalError);
      expect(returnedError).toBeInstanceOf(expected_error_class);
    },
  );
});
