import { Task } from '../../../src/domain/task';
import { updateTaskUsecase } from '../../../src/usecases/update-task-usecase';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { handler } from '../../../src/handlers/update-task-handler';
import { ErrorCode } from '../../../src/common/errors/error-codes';

jest.mock('../../../src/usecases/update-task-usecase');

describe('Update Task Request Handler', () => {
  beforeEach(() => {
    (updateTaskUsecase as jest.Mock).mockClear();
  });

  const taskId = 'f0f8f5a0-309d-11ec-8d3d-0242ac130003';
  const dummyTaskWithDescription: Task = {
    id: taskId,
    title: 'スーパーに買い物に行くの更新',
    completed: false,
    description: '牛乳と卵を買うの更新',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  const dummyTaskWithoutDescription: Task = {
    ...dummyTaskWithDescription,
    description: undefined,
  };

  const updateReqWithDescription = {
    title: dummyTaskWithDescription.title,
    description: dummyTaskWithDescription.description,
  };

  const updateReqWithoutDescription = {
    title: dummyTaskWithDescription.title,
  };

  const updateReqWithoutTitle = {
    description: dummyTaskWithDescription.description,
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
        description: 'with title and description',
      },
      {
        request: {
          body: JSON.stringify(updateReqWithoutDescription),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        body: updateReqWithoutDescription,
        expectedTask: dummyTaskWithoutDescription,
        description: 'with only title',
      },
      {
        request: {
          body: JSON.stringify(updateReqWithoutTitle),
          pathParameters: { id: taskId },
        } as unknown as APIGatewayEvent,
        body: updateReqWithoutTitle,
        expectedTask: dummyTaskWithoutDescription,
        description: 'with only description',
      },
    ];

    validCases.forEach(({ request, body, expectedTask, description }) => {
      test(`should return 200 ${description}`, async () => {
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
