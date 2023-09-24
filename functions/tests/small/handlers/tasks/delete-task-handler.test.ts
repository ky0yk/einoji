import { APIGatewayEvent, Context } from 'aws-lambda';
import { deleteTaskUseCase } from '../../../../src/usecases/tasks/delete-task-usecase';
import { handler } from '../../../../src/handlers/tasks/delete-task-handler';
import { AppError } from '../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';

jest.mock('../../../../src/usecases/tasks/delete-task-usecase');

describe('deleteTaskHandler', () => {
  beforeEach(() => {
    (deleteTaskUseCase as jest.Mock).mockClear();
  });

  const dummyContext = {} as Context;

  const mockValidEvent = {
    pathParameters: { id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003' },
  } as unknown as APIGatewayEvent;

  test('valid request should return status 204 with no content', async () => {
    (deleteTaskUseCase as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await handler(mockValidEvent, dummyContext);

    expect(result.statusCode).toBe(204);
    expect(result.body).toBeUndefined();
    expect(deleteTaskUseCase).toHaveBeenCalledTimes(1);
    expect(deleteTaskUseCase).toHaveBeenCalledWith(
      mockValidEvent.pathParameters!.id,
    );
  });

  test('task not found should return status 404 with TASK_NOT_FOUND', async () => {
    (deleteTaskUseCase as jest.Mock).mockRejectedValueOnce(
      new AppError(ErrorCode.TASK_NOT_FOUND, 'task not found'),
    );
    const result = await handler(mockValidEvent, dummyContext);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body!).code).toBe(ErrorCode.TASK_NOT_FOUND);
    expect(deleteTaskUseCase).toHaveBeenCalledTimes(1);
    expect(deleteTaskUseCase).toHaveBeenCalledWith(
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
    expect(deleteTaskUseCase).toHaveBeenCalledTimes(0);
  });
});
