import { Task } from '../../../src/domain/task';
import { TaskItem } from '../../../src/infrastructure/ddb/schemas/task-item';
import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';
import {
  createTable,
  deleteTable,
  putTask,
} from '../../helpers/task-repository-helpers';

describe('getTaskUseCase', () => {
  beforeAll(async () => {
    await createTable();
  });

  afterAll(async () => {
    await deleteTable();
  });

  test('should return a task when it exists', async () => {
    const dummyTaskItem: TaskItem = {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
      taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };
    const expectedTask: Task = {
      id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };

    await putTask(dummyTaskItem);
    const result = await getTaskUseCase(dummyTaskItem.taskId);

    expect(result).toEqual(expectedTask);
  });
});
