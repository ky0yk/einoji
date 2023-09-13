import { AppError } from '../../../src/common/errors/app-errors';
import { ErrorCode } from '../../../src/common/errors/error-codes';
import { Task } from '../../../src/domain/task';
import { taskRepository } from '../../../src/infrastructure/ddb/task-repository';
import { updateTaskUsecase } from '../../../src/usecases/update-task-usecase';

jest.mock('../../../src/infrastructure/ddb/task-repository');

describe('updateTaskUsecase', () => {
  beforeEach(() => {
    (taskRepository.update as jest.Mock).mockClear();
  });

  const validTaskId = 'valid-task-id';
  const descriptionWithOnlyTitle = 'update with only title';
  const descriptionWithTitleAndDesc = 'update with title and description';
  const updateDataOnlyTitle = { title: 'スーパーに買い物に行くの更新' };
  const updateDataWithTitleAndDesc = {
    title: 'スーパーに買い物に行くの更新',
    description: '牛乳と卵を買うの更新',
  };

  test.each`
    description                    | updateData                    | expectedDescription
    ${descriptionWithOnlyTitle}    | ${updateDataOnlyTitle}        | ${''}
    ${descriptionWithTitleAndDesc} | ${updateDataWithTitleAndDesc} | ${'牛乳と卵を買うの更新'}
  `('should $description', async ({ updateData, expectedDescription }) => {
    const dummyUpdatedTask: Task = {
      id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: updateData.title,
      completed: false,
      description: expectedDescription || '',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };

    (taskRepository.update as jest.Mock).mockResolvedValue(dummyUpdatedTask);

    const result = await updateTaskUsecase(validTaskId, updateData);

    expect(taskRepository.update).toHaveBeenCalledTimes(1);
    expect(taskRepository.update).toHaveBeenCalledWith(validTaskId, updateData);
    expect(result).toEqual(dummyUpdatedTask);
  });

  test('should throw TaskUpdateRuleError if update data is empty', async () => {
    const err = await updateTaskUsecase(validTaskId, {}).catch((e) => e);

    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toEqual(ErrorCode.TASK_UPDATE_RULE_ERROR);
    expect(taskRepository.update).not.toHaveBeenCalled();
  });
});
