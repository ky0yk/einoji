import { handler } from '../../../../src/handlers/tasks/create-task-handler';
import { Task } from '../../../../src/domain/task/task';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { createTaskUseCase } from '../../../../src/usecases/tasks/create-task-usecase';
import { CreateTaskRequest } from '../../../../src/handlers/tasks/schemas/task-requests';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';

jest.mock('../../../../src/usecases/tasks/create-task-usecase');

describe('Create Task Request Handler', () => {
  beforeEach(() => {
    (createTaskUseCase as jest.Mock).mockClear();
  });

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

  const createReq: CreateTaskRequest = {
    title: 'スーパーに買い物に行く',
    description: '牛乳と卵を買う',
  };

  const createReqWithoutDescription: CreateTaskRequest = {
    title: 'スーパーに買い物に行く',
  };

  const createReqWithoutTitle = {
    description: '牛乳と卵を買う',
  };

  const requestContext = {
    authorizer: {
      claims: {
        sub: 'dummy-user-id',
      },
    },
  };

  const validEvent = {
    body: JSON.stringify(createReq),
    requestContext: requestContext,
  } as unknown as APIGatewayProxyEvent;

  const validEventWithoutDescription = {
    body: JSON.stringify(createReqWithoutDescription),
    requestContext: requestContext,
  } as unknown as APIGatewayProxyEvent;

  const InvalidEventWithoutTitle = {
    body: JSON.stringify(createReqWithoutTitle),
    requestContext: requestContext,
  } as unknown as APIGatewayProxyEvent;

  const InvalidEventNullBody = {
    body: JSON.stringify(null),
    requestContext: requestContext,
  } as unknown as APIGatewayProxyEvent;

  const dummyContext = {} as Context;

  describe('For a valid request', () => {
    const validCases = [
      {
        request: validEvent,
        body: createReq,
        expectedTask: dummyTask,
        description: 'with title and description',
      },
      {
        request: validEventWithoutDescription,
        body: createReqWithoutDescription,
        expectedTask: dummyTaskWithoutDescription,
        description: 'with only title',
      },
    ];

    validCases.forEach(({ request, body, expectedTask, description }) => {
      test(`should return 201 ${description}`, async () => {
        (createTaskUseCase as jest.Mock).mockResolvedValueOnce(expectedTask);

        const result = await handler(
          request as APIGatewayProxyEvent,
          dummyContext,
        );
        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body!)).toEqual(expectedTask);
        expect(createTaskUseCase).toHaveBeenCalledTimes(1);
        expect(createTaskUseCase).toHaveBeenCalledWith(
          request.requestContext.authorizer?.claims.sub,
          body,
        );
      });
    });
  });

  describe('For an invalid request format', () => {
    const invalidFormatCases = [
      { request: InvalidEventNullBody, situation: 'body is null' },
      { request: InvalidEventWithoutTitle, situation: 'title is missing' },
    ];

    invalidFormatCases.forEach(({ request, situation }) => {
      test(`should return 400 with INVALID_PAYLOAD_FORMAT when ${situation}`, async () => {
        const result = await handler(
          request as APIGatewayProxyEvent,
          dummyContext,
        );
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body!).code).toBe(
          ErrorCode.INVALID_PAYLOAD_FORMAT,
        );
        expect(createTaskUseCase).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('For an invalid payload value but valid request format', () => {
    const invalidValueCases = [
      {
        request: {
          body: JSON.stringify({
            title: 'a'.repeat(101),
          }),
          requestContext: {
            authorizer: {
              claims: {
                sub: 'dummy-user-id',
              },
            },
          },
        } as unknown as APIGatewayProxyEvent,
        situation: 'title has 101 characters',
      },
      {
        request: {
          body: JSON.stringify({
            title: 'タイトル',
            description: 'a'.repeat(1001),
          }),
          requestContext: {
            authorizer: {
              claims: {
                sub: 'dummy-user-id',
              },
            },
          },
        } as unknown as APIGatewayProxyEvent,
        situation: 'description has 1001 characters',
      },
    ];

    invalidValueCases.forEach(({ request, situation }) => {
      test(`should return 422 with INVALID_PAYLOAD_VALUE but correct format when ${situation}`, async () => {
        const result = await handler(
          request as APIGatewayProxyEvent,
          dummyContext,
        );
        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body!).code).toBe(
          ErrorCode.INVALID_PAYLOAD_VALUE,
        );
        expect(createTaskUseCase).toHaveBeenCalledTimes(0);
      });
    });
  });
});
