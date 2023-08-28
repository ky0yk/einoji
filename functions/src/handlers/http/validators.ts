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
    const errorDetails = eventResult.error.errors
      .map((e) => e.message)
      .join(', ');
    throw new AppError(
      ErrorCode.INVALID_PAYLOAD,
      `Invalid or missing event body. Details: ${errorDetails}`,
    );
  }
  return eventResult.data;
};

export const validateEventWithPathParams = (event: APIGatewayEvent) => {
  const eventResult = EventWithPathParamSchema.safeParse(event);

  if (!eventResult.success) {
    const errorDetails = eventResult.error.errors
      .map((e) => e.message)
      .join(', ');
    throw new AppError(
      ErrorCode.INVALID_PAYLOAD,
      `Invalid or missing path parameters. Expecting a UUID format for the ID. Details: ${errorDetails}`,
    );
  }
  return eventResult.data;
};

export const validateBody = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  str: string,
) => {
  const bodyResult = schema.safeParse(JSON.parse(str));

  if (!bodyResult.success) {
    const errorDetails = bodyResult.error.errors
      .map((e) => e.message)
      .join(', ');
    throw new AppError(
      ErrorCode.INVALID_PAYLOAD,
      `Invalid or malformed request body. Details: ${errorDetails}`,
    );
  }
  return bodyResult.data;
};
