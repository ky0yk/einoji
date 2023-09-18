import { AppError } from '../../../../src/common/errors/app-errors';
import { ErrorCode } from '../../../../src/common/errors/error-codes';

import {
  TaskNotFoundError,
  TaskUpdateRuleError,
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
    ${new TaskUpdateRuleError('')}                                  | ${ErrorCode.TASK_UPDATE_RULE_ERROR}
    ${new DdbResourceNotFoundError('', originalError)}              | ${ErrorCode.DATABASE_CONNECTION_ERROR}
    ${new DdbProvisionedThroughputExceededError('', originalError)} | ${ErrorCode.DATABASE_CONNECTION_ERROR}
    ${new DdbValidationError('', originalError)}                    | ${ErrorCode.INVALID_PAYLOAD_VALUE}
    ${new DdbInternalServerError('', originalError)}                | ${ErrorCode.DATABASE_CONNECTION_ERROR}
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
