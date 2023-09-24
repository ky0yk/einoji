import { Task } from '../../../../src/domain/task/task';
import { updateTaskUsecase } from '../../../../src/usecases/tasks/update-task-usecase';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';
import { handler } from '../../../../src/handlers/tasks/update-task-handler';

jest.mock('../../../../src/usecases/tasks/update-task-usecase');

describe('Update Task Request Handler', () => {
  beforeEach(() => {
    (updateTaskUsecase as jest.Mock).mockClear();
  });

  const taskId = 'f0f8f5a0-309d-11ec-8d3d-0242ac130003';

  const dummyTaskWithDescription: Task = {
    id: taskId,
    title: 'スーパーで買い物',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  const dummyTaskWithoutDescription: Task = {
    id: taskId,
    title: 'スーパーで買い物',
    completed: false,
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  const updateReqWithDescription = {
    title: '図書館で本を借りる',
    description: 'ミステリー小説と料理の本を探す',
  };

  const updateReqWithoutDescription = {
    title: '図書館で本を借りる',
  };

  const updateReqWithoutTitle = {
    description: 'ミステリー小説と料理の本を探す',
  };

  const dummyContext = {} as Context;

  describe('For a valid request', () => {
    const validCases = [
      {
        request: {
          body: JSON.stringify(updateReqWithDescription),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        body: updateReqWithDescription,
        expectedTask: dummyTaskWithDescription,
        situation: 'with title and description',
      },
      {
        request: {
          body: JSON.stringify(updateReqWithoutDescription),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        body: updateReqWithoutDescription,
        expectedTask: dummyTaskWithoutDescription,
        situation: 'with only title',
      },
      {
        request: {
          body: JSON.stringify(updateReqWithoutTitle),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        body: updateReqWithoutTitle,
        expectedTask: dummyTaskWithoutDescription,
        situation: 'with only description',
      },
    ];

    validCases.forEach(({ request, body, expectedTask, situation }) => {
      test(`should return 200 ${situation}`, async () => {
        (updateTaskUsecase as jest.Mock).mockResolvedValueOnce(expectedTask);

        const result = await handler(request, dummyContext);
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body!)).toEqual(expectedTask);
        expect(updateTaskUsecase).toHaveBeenCalledTimes(1);
        expect(updateTaskUsecase).toHaveBeenCalledWith(taskId, body);
      });
    });
  });

  describe('For an invalid request format', () => {
    const invalidFormatCases = [
      {
        request: {
          body: JSON.stringify(null),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        expectedErrorCode: ErrorCode.INVALID_PAYLOAD_FORMAT,
        situation: 'body is null',
      },
      {
        request: {
          body: JSON.stringify(updateReqWithDescription),
        } as unknown as APIGatewayEvent,
        expectedErrorCode: ErrorCode.INVALID_PATH_PARAMETER,
        situation: 'path parameter is missing',
      },
    ];

    invalidFormatCases.forEach(({ request, expectedErrorCode, situation }) => {
      test(`should return 400 with INVALID_PAYLOAD_FORMAT when ${situation}`, async () => {
        const result = await handler(request, dummyContext);
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body!).code).toBe(expectedErrorCode);
        expect(updateTaskUsecase).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('For an invalid payload value but valid request format', () => {
    const invalidValueCases = [
      {
        request: {
          body: JSON.stringify({
            title: 'a'.repeat(101),
            description: dummyTaskWithDescription.description,
          }),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        situation: 'title has 101 characters',
      },
      {
        request: {
          body: JSON.stringify({
            title: dummyTaskWithDescription.title,
            description: 'a'.repeat(1001),
          }),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        situation: 'description has 1001 characters',
      },
    ];

    invalidValueCases.forEach(({ request, situation }) => {
      test(`should return 422 with INVALID_PAYLOAD_VALUE but correct format when ${situation}`, async () => {
        const result = await handler(request, dummyContext);
        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body!).code).toBe(
          ErrorCode.INVALID_PAYLOAD_VALUE,
        );
        expect(updateTaskUsecase).toHaveBeenCalledTimes(0);
      });
    });
  });
});
