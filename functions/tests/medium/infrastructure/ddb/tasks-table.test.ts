import { TaskRecord } from '../../../../src/domain/taskRecord';
import {
  CreateTaskBody,
  createTask,
  fetchTaskById,
} from '../../../../src/infrastructure/ddb/tasks-table';
import {
  createTable,
  deleteTable,
  deleteTask,
  getTask,
  putTask,
} from './tasks-table-helper';

describe('createTask', () => {
  const dummyTaskBody: CreateTaskBody = {
    title: 'スーパーに買い物に行く',
    description: '牛乳と卵を買う',
  };

  beforeAll(async () => {
    await createTable();
  });

  afterAll(async () => {
    await deleteTable();
  });

  test('should add a new task to the DynamoDB table', async () => {
    const newTaskId = await createTask(dummyTaskBody);

    const createdTask = await getTask(newTaskId);
    if (!createdTask) {
      throw new Error('Created task not found');
    }
    expect(createdTask).toBeDefined();

    expect(createdTask.taskId).toEqual(newTaskId);

    expect(createdTask.title).toEqual(dummyTaskBody.title);
    expect(createdTask.description).toEqual(dummyTaskBody.description);
    expect(createdTask.completed).toEqual(false);
  });
});

describe('fetchTaskById', () => {
  const dummyTaskRecord: TaskRecord = {
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
    await putTask(dummyTaskRecord);
  });
  afterEach(async () => {
    await deleteTask(dummyTaskRecord.taskId);
  });

  test('should return the dummy task record by task ID', async () => {
    const taskRecord = await fetchTaskById(dummyTaskRecord.taskId);
    expect(taskRecord).toEqual(dummyTaskRecord);
  });

  test('should return null if the task ID does not exist', async () => {
    const nonExistentTaskId = 'non-existent-task-id';

    const taskRecord = await fetchTaskById(nonExistentTaskId);
    expect(taskRecord).toBeNull();
  });
});
