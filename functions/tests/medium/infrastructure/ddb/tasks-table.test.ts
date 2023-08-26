import { TaskItem } from '../../../../src/domain/taskItem';

import { getTaskItemById } from '../../../../src/infrastructure/ddb/tasks-table';
import {
  createTable,
  deleteTable,
  deleteTask,
  putTask,
} from '../../../helpers/tasks-table-helpers';

describe('getTaskItemById', () => {
  const dummyTaskItem: TaskItem = {
    userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
    taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };
  beforeAll(async () => {
    await createTable();
  });
  afterAll(async () => {
    await deleteTable();
  });
  beforeEach(async () => {
    await putTask(dummyTaskItem);
  });
  afterEach(async () => {
    await deleteTask(dummyTaskItem.taskId);
  });

  test('should return the dummy task item by task ID', async () => {
    const TaskItem = await getTaskItemById(dummyTaskItem.taskId);
    expect(TaskItem).toEqual(dummyTaskItem);
  });

  test('should return null if the task ID does not exist', async () => {
    const nonExistentTaskId = 'non-existent-task-id';

    const TaskItem = await getTaskItemById(nonExistentTaskId);
    expect(TaskItem).toBeNull();
  });
});
