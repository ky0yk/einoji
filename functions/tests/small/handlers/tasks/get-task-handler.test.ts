import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getTaskUseCase } from '../../../../src/usecases/tasks/get-task-usecase';
import { Task } from '../../../../src/domain/task/task';
import { handler } from '../../../../src/handlers/tasks/get-task-handler';
import { AppError } from '../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';

jest.mock('../../../../src/usecases/tasks/get-task-usecase');

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
    requestContext: {
      authorizer: {
        claims: {
          sub: 'dummy-user-id',
        },
      },
    },
  } as unknown as APIGatewayProxyEvent;

  test('valid request should return the task with status 200', async () => {
    (getTaskUseCase as jest.Mock).mockResolvedValueOnce(dummyTask);
    const result = await handler(mockValidEvent, dummyContext);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual(dummyTask);
    expect(getTaskUseCase).toHaveBeenCalledTimes(1);
    expect(getTaskUseCase).toHaveBeenCalledWith(
      mockValidEvent.requestContext.authorizer?.claims.sub,
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
      mockValidEvent.requestContext.authorizer?.claims.sub,
      mockValidEvent.pathParameters!.id,
    );
  });

  test('invalid request should return status 400 with INVALID_PATH_PARAMETER', async () => {
    const mockEvent = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'dummy-user-id',
          },
        },
      },
    } as unknown as APIGatewayProxyEvent;
    const result = await handler(mockEvent, dummyContext);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body!).code).toBe(
      ErrorCode.INVALID_PATH_PARAMETER,
    );
    expect(getTaskUseCase).toHaveBeenCalledTimes(0);
  });
});
