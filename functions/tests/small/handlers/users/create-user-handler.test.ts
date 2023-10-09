import { handler } from '../../../../src/handlers/users/create-user-handler';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { createUserUsecase } from '../../../../src/usecases/users/create-user-usecase';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';

jest.mock('../../../../src/usecases/users/create-user-usecase');

describe('Create User Handler', () => {
  beforeEach(() => {
    (createUserUsecase as jest.Mock).mockClear();
  });

  const dummyContext = {} as Context;

  const validInput = { email: 'johndoe@example.com', password: 'P@ssword123' };
  const validEvent: APIGatewayEvent = {
    body: JSON.stringify(validInput),
  } as unknown as APIGatewayEvent;

  describe('For a valid request', () => {
    test('should create a new user and return 201 status code', async () => {
      const dummyUserId = 'dummy-user-id';

      (createUserUsecase as jest.Mock).mockResolvedValueOnce(dummyUserId);

      const result = await handler(validEvent, dummyContext);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body!)).toEqual({ userId: dummyUserId });
      expect(createUserUsecase).toHaveBeenCalledTimes(1);
      expect(createUserUsecase).toHaveBeenCalledWith(validInput);
    });
  });

  describe('For invalid requests', () => {
    const invalidInputs = [
      { email: 'johndoe@example.com' },
      { password: 'P@ssword123' },
      {},
    ];

    test.each(invalidInputs)(
      'should return 400 status code for invalid input %p',
      async (input) => {
        const event: APIGatewayEvent = {
          body: JSON.stringify(input),
        } as unknown as APIGatewayEvent;

        const result = await handler(event, dummyContext);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body!).code).toBe(
          ErrorCode.INVALID_PAYLOAD_FORMAT,
        );
        expect(createUserUsecase).toHaveBeenCalledTimes(0);
      },
    );
  });
});
