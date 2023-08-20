import { ClientError, ServerError } from '../../../../src/common/app-errors';
import { ErrorCode } from '../../../../src/common/error-codes';
import {
  TaskConversionError,
  TaskNotFoundError,
  TaskUnknownError,
} from '../../../../src/domain/errors/task-errors';
import {
  DdbClientError,
  DdbServerError,
  DdbUnknownError,
} from '../../../../src/infrastructure/ddb/errors/ddb-errors';
import { useCaseErrorHandler } from '../../../../src/usecases/factory/usecase-error-handler';

describe('useCaseErrorHandler', () => {
  test.each`
    error_instance                   | expected_error_class | expected_error_code
    ${new TaskNotFoundError('')}     | ${ClientError}       | ${ErrorCode.TASK_NOT_FOUND}
    ${new TaskConversionError('')}   | ${ServerError}       | ${ErrorCode.TASK_CONVERSION_ERROR}
    ${new TaskUnknownError('')}      | ${ServerError}       | ${ErrorCode.TASK_UNKNOWN_ERROR}
    ${new DdbClientError('')}        | ${ClientError}       | ${ErrorCode.DDB_CLIENT_ERROR}
    ${new DdbServerError('')}        | ${ServerError}       | ${ErrorCode.DDB_SERVER_ERROR}
    ${new DdbUnknownError('')}       | ${ServerError}       | ${ErrorCode.DDB_UNKNOWN_ERROR}
    ${new Error('Some other error')} | ${ServerError}       | ${ErrorCode.INTERNAL_SERVER_ERROR}
  `(
    'returns correct error for $error_instance.name',
    ({ error_instance, expected_error_class, expected_error_code }) => {
      const resultError = useCaseErrorHandler(error_instance);

      expect(resultError).toBeInstanceOf(expected_error_class);
      expect(resultError.code).toBe(expected_error_code);
    },
  );
});
