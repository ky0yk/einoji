import { ZodObject, ZodRawShape, z } from 'zod';
import { AppError } from '../../common/errors/app-errors';
import { ErrorCode } from '../../common/errors/error-codes';
import { APIGatewayEvent } from 'aws-lambda';

const EventSchema = z.object({
  body: z.string(),
});

const EventWithPathParamSchema = z.object({
  pathParameters: z.object({ id: z.string().uuid() }),
});

export const validateEvent = (event: APIGatewayEvent) => {
  const eventResult = EventSchema.safeParse(event);

  if (!eventResult.success) {
    throw new AppError(ErrorCode.INVALID_REQUEST);
  }
  return eventResult.data;
};

export const validateEventWithPathParams = (event: APIGatewayEvent) => {
  const eventResult = EventWithPathParamSchema.safeParse(event);

  if (!eventResult.success) {
    throw new AppError(ErrorCode.INVALID_REQUEST);
  }
  return eventResult.data;
};

export const validateBody = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  str: string,
) => {
  const bodyResult = schema.safeParse(JSON.parse(str));

  if (!bodyResult.success) {
    throw new AppError(ErrorCode.INVALID_REQUEST);
  }
  return bodyResult.data;
};
