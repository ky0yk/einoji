import { TaskItem } from '../../../../src/infrastructure/ddb/schemas/task-item';
import { taskRepository } from '../../../../src/infrastructure/ddb/task-repository';
import { CreateTaskRequest } from '../../../../src/handlers/tasks/schemas/task-requests';
import {
  createTable,
  deleteTable,
  deleteTask,
  putTask,
} from '../../../helpers/task-repository-helpers';
import { Task } from '../../../../src/domain/task/task';

const dummyUserId = '1a7244c5-06d3-47e2-560e-f0b5534c8246';

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
  id: dummyTaskItem.taskId,
  title: dummyTaskItem.title,
  completed: dummyTaskItem.completed,
  description: dummyTaskItem.description,
  createdAt: dummyTaskItem.createdAt,
  updatedAt: dummyTaskItem.updatedAt,
};

const setupTasks = async () => {
  await putTask(dummyTaskItem);
};

const cleanupTasks = async () => {
  await deleteTask(dummyTaskItem.taskId);
};

describe('taskRepository', () => {
  beforeAll(async () => {
    await createTable();
  });

  afterAll(async () => {
    await deleteTable();
  });

  describe('.create', () => {
    test('should add a new task to the DynamoDB table', async () => {
      const dummyTaskBody: CreateTaskRequest = {
        title: dummyTaskItem.title,
        description: dummyTaskItem.description,
      };
      const newTaskId = await taskRepository.create(dummyUserId, dummyTaskBody);

      const createdTask = await taskRepository.findById(dummyUserId, newTaskId);
      expect(createdTask).toBeDefined();

      expect(createdTask!.id).toEqual(newTaskId);
      expect(createdTask!.title).toEqual(dummyTaskBody.title);
      expect(createdTask!.description).toEqual(dummyTaskBody.description);
      expect(createdTask!.completed).toEqual(false);
    });
  });

  describe('.findById', () => {
    beforeEach(setupTasks);
    afterEach(cleanupTasks);

    test('should return the TaskItem by correct task ID', async () => {
      const Task = await taskRepository.findById(
        dummyUserId,
        dummyTaskItem.taskId,
      );
      expect(Task).toEqual(dummyTask);
    });

    test('should return null if the task ID does not exist', async () => {
      const nonExistentTaskId = 'non-existent-task-id';

      const TaskItem = await taskRepository.findById(
        dummyUserId,
        nonExistentTaskId,
      );
      expect(TaskItem).toBeNull();
    });
  });

  describe('.update', () => {
    beforeEach(setupTasks);
    afterEach(cleanupTasks);

    test('should update a task successfully when provided with both title and description', async () => {
      const updateData = {
        title: '新しいタイトル',
        description: '新しい説明',
      };

      await taskRepository.update(
        dummyUserId,
        dummyTaskItem.taskId,
        updateData,
      );
      const updatedTask = await taskRepository.findById(
        dummyUserId,
        dummyTaskItem.taskId,
      );
      expect(updatedTask!.title).toEqual(updateData.title);
      expect(updatedTask!.description).toEqual(updateData.description);
    });

    test('should update a task successfully when provided only with title', async () => {
      const updateData = {
        title: '新しいタイトルのみ',
      };

      await taskRepository.update(
        dummyUserId,
        dummyTaskItem.taskId,
        updateData,
      );
      const updatedTask = await taskRepository.findById(
        dummyUserId,
        dummyTaskItem.taskId,
      );
      expect(updatedTask!.title).toEqual(updateData.title);
      expect(updatedTask!.description).toEqual(dummyTaskItem.description);
    });
  });

  describe('.delete', () => {
    beforeEach(setupTasks);
    afterEach(cleanupTasks);

    test('should delete the task when provided a correct task ID', async () => {
      await taskRepository.delete(dummyUserId, dummyTaskItem.taskId);
      const deletedTask = await taskRepository.findById(
        dummyUserId,
        dummyTaskItem.taskId,
      );
      expect(deletedTask).toBeNull();
    });
  });
});
