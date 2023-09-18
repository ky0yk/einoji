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
describe('taskRepository.create', () => {
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

    const createdTask = await taskRepository.findById(newTaskId);
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

describe('taskRepository.findById', () => {
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
    const Task = await taskRepository.findById(dummyTask.id);
    expect(Task).toEqual(dummyTask);
  });

  test('should return null if the task ID does not exist', async () => {
    const nonExistentTaskId = 'non-existent-task-id';

    const TaskItem = await taskRepository.findById(nonExistentTaskId);
    expect(TaskItem).toBeNull();
  });
});

describe('taskRepository.update', () => {
  beforeAll(async () => {
    await createTable();
  });

  afterAll(async () => {
    await deleteTable();
  });

  describe('update', () => {
    const originalTaskItem: TaskItem = {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
      taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };

    beforeEach(async () => {
      await putTask(originalTaskItem);
    });

    afterEach(async () => {
      await deleteTask(originalTaskItem.taskId);
    });

    test('should update a task successfully when provided with both title and description', async () => {
      const updateData = {
        title: '新しいタイトル',
        description: '新しい説明',
      };

      await taskRepository.update(originalTaskItem.taskId, updateData);

      const updatedTask = await taskRepository.findById(
        originalTaskItem.taskId,
      );
      if (!updatedTask) {
        throw new Error('Updated task not found');
      }

      expect(updatedTask.title).toEqual(updateData.title);
      expect(updatedTask.description).toEqual(updateData.description);
    });

    test('should update a task successfully when provided only with title', async () => {
      const updateData = {
        title: '新しいタイトルのみ',
      };

      await taskRepository.update(originalTaskItem.taskId, updateData);

      const updatedTask = await taskRepository.findById(
        originalTaskItem.taskId,
      );
      if (!updatedTask) {
        throw new Error('Updated task not found');
      }

      expect(updatedTask.title).toEqual(updateData.title);
      expect(updatedTask.description).toEqual(originalTaskItem.description);
    });
  });
});

describe('taskRepository.delete', () => {
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

  const dummyTaskItem: TaskItem = {
    userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
    taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  test('should delete the task when provided a correct task ID', async () => {
    await taskRepository.delete(dummyTaskItem.taskId);

    const deletedTask = await taskRepository.findById(dummyTaskItem.taskId);
    expect(deletedTask).toBeNull();
  });
});
