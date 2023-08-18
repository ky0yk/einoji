import { Task, toTask } from '../../../src/domain/task';
import { TaskItem } from '../../../src/domain/taskItem';
import { CreateTaskRequest } from '../../../src/handlers/request_schemas/create-task-request';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import {
  createTable,
  deleteTable,
  getTask,
} from '../../helper/tasks-table-helper';

const taskBody: CreateTaskRequest = {
  title: 'コーヒーを淹れる',
  description: '濃いめで',
};

describe('createTaskUseCase', () => {
  beforeAll(async () => {
    await createTable();
  });
  afterAll(async () => {
    await deleteTable();
  });

  test('should create a task successfully in the real database', async () => {
    const createdTask: Task = await createTaskUseCase(taskBody);

    const fetchedTaskRecord: TaskItem = await getTask(createdTask.id);
    const fetchedTask: Task = toTask(fetchedTaskRecord);

    expect(fetchedTask).toEqual(createdTask);
  });
});
