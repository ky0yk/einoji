import {
  TaskNotFoundError,
  TaskUpdateRuleError,
} from '../../../../../src/domain/task/errors/task-errors';
import {
  DdbValidationError,
  DdbInternalServerError,
} from '../../../../../src/infrastructure/ddb/errors/ddb-errors';
import { taskUsecaseErrorHandler } from '../../../../../src/usecases/tasks/factory/task-usecase-error-handler';
import { AppError } from '../../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../../src/utils/errors/error-codes';

describe('useCaseErrorHandler', () => {
  const originalError = new Error('Original DDB error');

  test.each`
    error_instance                                   | expected_error_code
    ${new TaskNotFoundError('')}                     | ${ErrorCode.TASK_NOT_FOUND}
    ${new TaskUpdateRuleError('')}                   | ${ErrorCode.TASK_UPDATE_RULE_ERROR}
    ${new DdbValidationError('', originalError)}     | ${ErrorCode.INVALID_PAYLOAD_VALUE}
    ${new DdbInternalServerError('', originalError)} | ${ErrorCode.EXTERNAL_SERVICE_FAILURE}
    ${new Error('Some other error')}                 | ${ErrorCode.UNKNOWN_ERROR}
  `(
    'given $error_instance it should return an error with class $EXPECTED_ERROR_CLASS and code $expected_error_code',
    ({ error_instance, expected_error_code }) => {
      const result = taskUsecaseErrorHandler(error_instance);
      expect(result).toBeInstanceOf(AppError);
      expect(result.code).toBe(expected_error_code);
    },
  );
});
