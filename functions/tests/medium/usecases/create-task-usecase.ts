import { toTask } from '../../../src/domain/task';
import { CreateTaskRequest } from '../../../src/handlers/http/requestSchemas/create-task-request';
import { getTaskItemById } from '../../../src/infrastructure/ddb/tasks-table';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import { createTable, deleteTable } from '../../helpers/tasks-table-helpers';

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

  test('should create a task successfully in the mock database', async () => {
    const createdTask = await createTaskUseCase(taskBody);

    const fetchedTaskItem = await getTaskItemById(createdTask.id);
    const fetchedTask = toTask(fetchedTaskItem!);

    expect(fetchedTask).toEqual(createdTask);
  });
});
