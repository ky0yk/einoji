import { _testExports } from '../../../src/handlers/get-task-handler';
import { ErrorCode } from '../../../src/common/error-codes';
import { HttpStatus } from '../../../src/handlers/utils/http-response';
import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';
import { Task } from '../../../src/domain/task';
import { APIGatewayEvent } from 'aws-lambda';

const { requestHandler } = _testExports;

jest.mock('../../../src/usecases/get-task-usecase');

describe('Request Handler', () => {
  const mockValidEvent = {
    pathParameters: { id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003' },
  } as unknown as APIGatewayEvent;

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

    const result = await requestHandler(mockValidEvent);
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(JSON.parse(result.body!)).toEqual(dummyTask);
    expect(getTaskUseCase).toHaveBeenCalledTimes(1);
    expect(getTaskUseCase).toHaveBeenCalledWith(
      mockValidEvent.pathParameters!.id,
    );
  });

  test('should return 400 status for an invalid request', async () => {
    const mockEvent = {} as APIGatewayEvent;

    const result = await requestHandler(mockEvent);
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.body!).errorCode).toBe(ErrorCode.INVALID_REQUEST);
    expect(getTaskUseCase).toHaveBeenCalledTimes(0);
  });
});
