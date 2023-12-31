import { AppError } from '../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';
import { Task } from '../../../../src/domain/task/task';
import { taskRepository } from '../../../../src/infrastructure/ddb/task-repository';
import { updateTaskUsecase } from '../../../../src/usecases/tasks/update-task-usecase';

jest.mock('../../../../src/infrastructure/ddb/task-repository');

describe('updateTaskUsecase', () => {
  beforeEach(() => {
    (taskRepository.update as jest.Mock).mockClear();
  });

  const userId = 'dummy-user-id';
  const validTaskId = 'valid-task-id';
  const situationWithOnlyTitle = 'update data contains only title';
  const situationWithTitleAndDesc =
    'update data contains both title and description';
  const updateDataOnlyTitle = { title: '図書館で学習する' };
  const updateDataWithTitleAndDesc = {
    title: '図書館で学習する',
    description: '参考書とノートを持って行く',
  };

  test.each`
    situation                    | updateData                    | expectedDescription
    ${situationWithOnlyTitle}    | ${updateDataOnlyTitle}        | ${''}
    ${situationWithTitleAndDesc} | ${updateDataWithTitleAndDesc} | ${'参考書とノートを持って行く'}
  `(
    'given $situation, should update appropriately',
    async ({ updateData, expectedDescription }) => {
      const dummyUpdatedTask: Task = {
        id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
        title: updateData.title,
        completed: false,
        description: expectedDescription || '',
        createdAt: '2021-06-22T14:24:02.071Z',
        updatedAt: '2021-06-22T14:24:02.071Z',
      };

      (taskRepository.update as jest.Mock).mockResolvedValue(dummyUpdatedTask);

      const result = await updateTaskUsecase(userId, validTaskId, updateData);

      expect(taskRepository.update).toHaveBeenCalledTimes(1);
      expect(taskRepository.update).toHaveBeenCalledWith(
        userId,
        validTaskId,
        updateData,
      );
      expect(result).toEqual(dummyUpdatedTask);
    },
  );

  test('given update data is empty, should throw TaskUpdateRuleError', async () => {
    const err = await updateTaskUsecase(userId, validTaskId, {}).catch(
      (e) => e,
    );

    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toEqual(ErrorCode.TASK_UPDATE_RULE_ERROR);
    expect(taskRepository.update).not.toHaveBeenCalled();
  });
});
