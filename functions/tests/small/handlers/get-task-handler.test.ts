import { ErrorCode } from '../../../src/common/error-codes';
import { HttpStatus } from '../../../src/handlers/http/http-response';
import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';
import { Task } from '../../../src/domain/task';
import { APIGatewayEvent, Context } from 'aws-lambda';

jest.mock('../../../src/usecases/get-task-usecase');

const mockValidEvent = {
  pathParameters: { id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003' },
} as unknown as APIGatewayEvent;

import { handler } from '../../../src/handlers/get-task-handler';
import { ClientError } from '../../../src/common/app-errors';

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

  test('should handle a valid request and return the task', async () => {
    const mockEvent = {
      pathParameters: { id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003' },
    } as unknown as APIGatewayEvent;
    (getTaskUseCase as jest.Mock).mockResolvedValueOnce(dummyTask);

    const result = await handler(mockEvent, dummyContext);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body!)).toEqual(dummyTask);
    expect(getTaskUseCase).toHaveBeenCalledTimes(1);
    expect(getTaskUseCase).toHaveBeenCalledWith(
      mockValidEvent.pathParameters!.id,
    );
  });

  test('should handle task not found and return a not found error', async () => {
    const mockEvent = {
      pathParameters: { id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003' },
    } as unknown as APIGatewayEvent;
    (getTaskUseCase as jest.Mock).mockRejectedValueOnce(
      new ClientError(ErrorCode.TASK_NOT_FOUND),
    );

    const result = await handler(mockEvent, dummyContext);
    expect(result.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(JSON.parse(result.body!).errorCode).toBe(ErrorCode.TASK_NOT_FOUND);
    expect(getTaskUseCase).toHaveBeenCalledTimes(1);
    expect(getTaskUseCase).toHaveBeenCalledWith(
      mockValidEvent.pathParameters!.id,
    );
  });

  test('should handle an invalid request and return a bad request error', async () => {
    const mockEvent = {} as unknown as APIGatewayEvent;

    const result = await handler(mockEvent, dummyContext);
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.body!).errorCode).toBe(ErrorCode.INVALID_REQUEST);
    expect(getTaskUseCase).toHaveBeenCalledTimes(0);
  });
});
