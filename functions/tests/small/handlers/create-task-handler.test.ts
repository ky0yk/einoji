import { handler } from '../../../src/handlers/create-task-handler';
import { ErrorCode } from '../../../src/common/error-codes';
import { HttpStatus } from '../../../src/handlers/http/http-response';
import { Task } from '../../../src/domain/task';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import { ClientError, ServerError } from '../../../src/common/app-errors';
import { CreateTaskRequest } from '../../../src/handlers/request_schemas/create-task-request';

jest.mock('../../../src/usecases/create-task-usecase');

describe('Request Handler', () => {
  const dummyTask: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  const dummyTaskWithoutDescription: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  const dummyBody: CreateTaskRequest = {
    title: 'スーパーに買い物に行く',
    description: '牛乳と卵を買う',
  };
  const dummyBodyWithoutDescription: CreateTaskRequest = {
    title: 'スーパーに買い物に行く',
  };
  const dummyBodyWithoutTitle = {
    description: '牛乳と卵を買う',
  };

  const mockValidEvent = {
    body: JSON.stringify(dummyBody),
  } as unknown as APIGatewayEvent;

  const mockValidEventWithoutDescription = {
    body: JSON.stringify(dummyBodyWithoutDescription),
  } as unknown as APIGatewayEvent;

  const mockInvalidEventWithoutTitle = {
    body: JSON.stringify(dummyBodyWithoutTitle),
  } as unknown as APIGatewayEvent;

  const mockInvalidEventNullBody = {
    body: JSON.stringify(null),
  } as unknown as APIGatewayEvent;

  const mockContext = {} as Context;

  beforeEach(() => {
    (createTaskUseCase as jest.Mock).mockClear();
  });

  test.each`
    request                             | body                           | task
    ${mockValidEvent}                   | ${dummyBody}                   | ${dummyTask}
    ${mockValidEventWithoutDescription} | ${dummyBodyWithoutDescription} | ${dummyTaskWithoutDescription}
  `(
    'should return 201 status for a valid request',
    async ({ request, body, task }) => {
      (createTaskUseCase as jest.Mock).mockResolvedValueOnce(task);

      const result = await handler(request, mockContext);
      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(JSON.parse(result.body!)).toEqual(task);
      expect(createTaskUseCase).toHaveBeenCalledTimes(1);
      expect(createTaskUseCase).toHaveBeenCalledWith(body);
    },
  );

  test.each`
    request
    ${mockInvalidEventNullBody}
    ${mockInvalidEventWithoutTitle}
  `('should return 400 status for an invalid request', async ({ request }) => {
    const result = await handler(request, mockContext);
    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(JSON.parse(result.body!).errorCode).toBe(ErrorCode.INVALID_REQUEST);
    expect(createTaskUseCase).toHaveBeenCalledTimes(0);
  });

  test.each`
    error                                           | statusCode                          | errorCode
    ${new ClientError(ErrorCode.DDB_CLIENT_ERROR)}  | ${HttpStatus.BAD_REQUEST}           | ${ErrorCode.DDB_CLIENT_ERROR}
    ${new ServerError(ErrorCode.DDB_SERVER_ERROR)}  | ${HttpStatus.INTERNAL_SERVER_ERROR} | ${ErrorCode.DDB_SERVER_ERROR}
    ${new ServerError(ErrorCode.DDB_UNKNOWN_ERROR)} | ${HttpStatus.INTERNAL_SERVER_ERROR} | ${ErrorCode.DDB_UNKNOWN_ERROR}
    ${new ServerError(ErrorCode.UNKNOWN_ERROR)}     | ${HttpStatus.INTERNAL_SERVER_ERROR} | ${ErrorCode.UNKNOWN_ERROR}
  `(
    'should return the appropriate HTTP status code based on the error code',
    async ({ error, statusCode, errorCode }) => {
      (createTaskUseCase as jest.Mock).mockRejectedValueOnce(error);

      const result = await handler(mockValidEvent, mockContext);
      expect(result.statusCode).toBe(statusCode);
      expect(JSON.parse(result.body!).errorCode).toBe(errorCode);
    },
  );
});
