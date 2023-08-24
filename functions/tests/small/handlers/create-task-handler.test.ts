import { handler } from '../../../src/handlers/create-task-handler';
import { Task } from '../../../src/domain/task';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import { CreateTaskRequest } from '../../../src/handlers/request_schemas/create-task-request';
import { ErrorCode } from '../../../src/common/errors/error-codes';

jest.mock('../../../src/usecases/create-task-usecase');

describe('Create Task Request Handler', () => {
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
      expect(result.statusCode).toBe(201);
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
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body!).code).toBe(ErrorCode.INVALID_REQUEST);
    expect(createTaskUseCase).toHaveBeenCalledTimes(0);
  });
});
