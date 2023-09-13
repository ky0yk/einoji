import { TaskItem } from '../../../../src/infrastructure/ddb/schemas/task-item';

import { taskRepository } from '../../../../src/infrastructure/ddb/task-repository';
import { Task } from '../../../../src/domain/task';
import { CreateTaskRequest } from '../../../../src/handlers/schemas/task-requests';
import {
  createTable,
  deleteTable,
  deleteTask,
  putTask,
} from '../../../helpers/task-repository-helpers';
describe('createTaskItem', () => {
  beforeAll(async () => {
    await createTable();
  });
  afterAll(async () => {
    await deleteTable();
  });

  test('should add a new task to the DynamoDB table', async () => {
    const dummyTaskBody: CreateTaskRequest = {
      title: 'スーパーに買い物に行く',
      description: '牛乳と卵を買う',
    };
    const newTaskId = await taskRepository.create(dummyTaskBody);

    const createdTask = await taskRepository.getById(newTaskId);
    if (!createdTask) {
      throw new Error('Created task not found');
    }
    expect(createdTask).toBeDefined();

    expect(createdTask.id).toEqual(newTaskId);

    expect(createdTask.title).toEqual(dummyTaskBody.title);
    expect(createdTask.description).toEqual(dummyTaskBody.description);
    expect(createdTask.completed).toEqual(false);
  });
});

describe('getTaskItemById', () => {
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
    await deleteTask(dummyTask.id);
  });
  const dummyTaskItem: TaskItem = {
    userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
    taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };
  const dummyTask: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  test('should return the TaskItem by correct task ID', async () => {
    const Task = await taskRepository.getById(dummyTask.id);
    expect(Task).toEqual(dummyTask);
  });

  test('should return null if the task ID does not exist', async () => {
    const nonExistentTaskId = 'non-existent-task-id';

    const TaskItem = await taskRepository.getById(nonExistentTaskId);
    expect(TaskItem).toBeNull();
  });
});
