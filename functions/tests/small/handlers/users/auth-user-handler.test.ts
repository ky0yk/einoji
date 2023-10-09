import { handler } from '../../../../src/handlers/users/auth-user-handler';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';
import { authUserUsecase } from '../../../../src/usecases/users/auth-user-usecase';

jest.mock('../../../../src/usecases/users/auth-user-usecase');

describe('Auth User Handler', () => {
  beforeEach(() => {
    (authUserUsecase as jest.Mock).mockClear();
  });

  const dummyContext = {} as Context;

  const validInput = { email: 'johndoe@example.com', password: 'P@ssword123' };
  const validEvent: APIGatewayEvent = {
    body: JSON.stringify(validInput),
  } as unknown as APIGatewayEvent;

  describe('For a valid request', () => {
    test('should authenticate a user and return 200 status code with token', async () => {
      const dummyToken = 'someRandomToken';

      (authUserUsecase as jest.Mock).mockResolvedValueOnce(dummyToken);

      const result = await handler(validEvent, dummyContext);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body!).token).toBe(dummyToken);
      expect(authUserUsecase).toHaveBeenCalledTimes(1);
      expect(authUserUsecase).toHaveBeenCalledWith(validInput);
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
        expect(authUserUsecase).toHaveBeenCalledTimes(0);
      },
    );
  });
});
