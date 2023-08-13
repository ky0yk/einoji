import { _testExports } from '../../../handlers/get-task-handler';
import { ErrorCode } from '../../../src/common/error-codes';
import { HttpStatus } from '../../../handlers/utils/http-response';
import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';
import { Task } from '../../../src/domain/task';
import { ClientError, ServerError } from '../../../src/common/app-errors';
import { APIGatewayEvent, Context } from 'aws-lambda';

const { requestHandler, errorHandler } = _testExports;

jest.mock('../../../src/usecases/get-task-usecase');

describe('Request Handler', () => {
  const mockValidEvent: APIGatewayEvent = {
    pathParameters: { id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003' },
  } as any;

  const dummyTask: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  beforeEach(() => {
    (getTaskUseCase as jest.Mock).mockClear();
  });

  test('should return 200 status for a valid request', async () => {
    (getTaskUseCase as jest.Mock).mockResolvedValueOnce(dummyTask);

    const result = await requestHandler(mockValidEvent, {} as any);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body!)).toEqual(dummyTask);
    expect(getTaskUseCase).toHaveBeenCalledTimes(1);
    expect(getTaskUseCase).toHaveBeenCalledWith(
      (mockValidEvent as any).pathParameters.id,
    );
  });

  test('should return 400 status for an invalid request', async () => {
    const mockEvent = {} as APIGatewayEvent;

    const result = await requestHandler(mockEvent, {} as any);
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.body!).errorCode).toBe(ErrorCode.INVALID_REQUEST);
    expect(getTaskUseCase).toHaveBeenCalledTimes(0);
  });
});

describe('Error Handler', () => {
  it('should handle different error codes', async () => {
    const taskNotFoundError = new ClientError(ErrorCode.TASK_NOT_FOUND);
    const ddbClientError = new ClientError(ErrorCode.DDB_CLIENT_ERROR);
    const unknownClientError = new ClientError(ErrorCode.INVALID_REQUEST);
    const ddbServerError = new ServerError(ErrorCode.DDB_SERVER_ERROR);
    const unknownError = new Error();

    expect((await errorHandler(taskNotFoundError)).statusCode).toBe(
      HttpStatus.NOT_FOUND,
    );
    expect((await errorHandler(ddbClientError)).statusCode).toBe(
      HttpStatus.BAD_REQUEST,
    );
    expect((await errorHandler(ddbServerError)).statusCode).toBe(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect((await errorHandler(unknownClientError)).statusCode).toBe(
      HttpStatus.BAD_REQUEST,
    );
    expect((await errorHandler(unknownError)).statusCode).toBe(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
