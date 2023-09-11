import { CreateTaskRequest } from '../../../src/handlers/schemas/task-requests';
import { taskRepository } from '../../../src/infrastructure/ddb/task-repository';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import {
  createTable,
  deleteTable,
} from '../../helpers/task-repository-helpers';

describe('createTaskUseCase', () => {
  beforeAll(async () => {
    await createTable();
  });
  afterAll(async () => {
    await deleteTable();
  });

  test('should create a task successfully in the mock database', async () => {
    const createTaskReq: CreateTaskRequest = {
      title: 'コーヒーを淹れる',
      description: '濃いめで',
    };
    const createdTask = await createTaskUseCase(createTaskReq);
    const fetchedTaskItem = await taskRepository.getById(createdTask.id);

    expect(fetchedTaskItem).toEqual(createdTask);
  });
});
