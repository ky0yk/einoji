import { AppError } from '../../../../src/common/errors/app-errors';
import { ErrorCode } from '../../../../src/common/errors/error-codes';

import {
  TaskConversionError,
  TaskNotFoundError,
  TaskUnknownError,
} from '../../../../src/domain/errors/task-errors';
import {
  DdbResourceNotFoundError,
  DdbProvisionedThroughputExceededError,
  DdbValidationError,
  DdbInternalServerError,
} from '../../../../src/infrastructure/ddb/errors/ddb-errors';
import { useCaseErrorHandler } from '../../../../src/usecases/factory/usecase-error-handler';

describe('useCaseErrorHandler', () => {
  const originalError = new Error('Original DDB error');

  test.each`
    error_instance                                                  | expected_error_code
    ${new TaskNotFoundError('')}                                    | ${ErrorCode.TASK_NOT_FOUND}
    ${new TaskConversionError('')}                                  | ${ErrorCode.TASK_CONVERSION_ERROR}
    ${new TaskUnknownError('')}                                     | ${ErrorCode.TASK_UNKNOWN_ERROR}
    ${new DdbResourceNotFoundError('', originalError)}              | ${ErrorCode.DDB_RESOURCE_NOT_FOUND}
    ${new DdbProvisionedThroughputExceededError('', originalError)} | ${ErrorCode.DDB_THROUGHPUT_EXCEEDED}
    ${new DdbValidationError('', originalError)}                    | ${ErrorCode.DDB_VALIDATION_ERROR}
    ${new DdbInternalServerError('', originalError)}                | ${ErrorCode.DDB_INTERNAL_SERVER_ERROR}
    ${new Error('Some other error')}                                | ${ErrorCode.UNKNOWN_ERROR}
  `(
    'given $error_instance it should return an error with class $EXPECTED_ERROR_CLASS and code $expected_error_code',
    ({ error_instance, expected_error_code }) => {
      const result = useCaseErrorHandler(error_instance);
      expect(result).toBeInstanceOf(AppError);
      expect(result.code).toBe(expected_error_code);
    },
  );
});
