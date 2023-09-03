import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';
import { Task } from '../../../src/domain/task';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { handler } from '../../../src/handlers/get-task-handler';
import { AppError } from '../../../src/common/errors/app-errors';
import { ErrorCode } from '../../../src/common/errors/error-codes';

jest.mock('../../../src/usecases/get-task-usecase');

describe('getTaskHandler', () => {
  beforeEach(() => {
    (getTaskUseCase as jest.Mock).mockClear();
  });

  const dummyTask: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };
  const dummyContext = {} as Context;

  const mockValidEvent = {
    pathParameters: { id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003' },
  } as unknown as APIGatewayEvent;

  test('valid request should return the task with status 200', async () => {
    (getTaskUseCase as jest.Mock).mockResolvedValueOnce(dummyTask);
    const result = await handler(mockValidEvent, dummyContext);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual(dummyTask);
    expect(getTaskUseCase).toHaveBeenCalledTimes(1);
    expect(getTaskUseCase).toHaveBeenCalledWith(
      mockValidEvent.pathParameters!.id,
    );
  });

  test('task not found should return status 404 with TASK_NOT_FOUND', async () => {
    (getTaskUseCase as jest.Mock).mockRejectedValueOnce(
      new AppError(ErrorCode.TASK_NOT_FOUND, 'task not found'),
    );
    const result = await handler(mockValidEvent, dummyContext);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body!).code).toBe(ErrorCode.TASK_NOT_FOUND);
    expect(getTaskUseCase).toHaveBeenCalledTimes(1);
    expect(getTaskUseCase).toHaveBeenCalledWith(
      mockValidEvent.pathParameters!.id,
    );
  });

  test('invalid request should return status 400 with INVALID_PATH_PARAMETER', async () => {
    const mockEvent = {} as unknown as APIGatewayEvent;
    const result = await handler(mockEvent, dummyContext);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body!).code).toBe(
      ErrorCode.INVALID_PATH_PARAMETER,
    );
    expect(getTaskUseCase).toHaveBeenCalledTimes(0);
  });
});
