import { ZodIssueCode, ZodObject, ZodRawShape, z } from 'zod';
import { AppError } from '../../common/errors/app-errors';
import { ErrorCode } from '../../common/errors/error-codes';
import { APIGatewayEvent } from 'aws-lambda';

const EventSchema = z.object({
  body: z.string(),
});

const EventWithPathParamSchema = z.object({
  pathParameters: z.object({ id: z.string().uuid() }),
});

type Event = z.infer<typeof EventSchema>;
type EventWithPathParams = z.infer<typeof EventWithPathParamSchema>;

export const validateEvent = (event: APIGatewayEvent): Event => {
  const eventResult = EventSchema.safeParse(event);

  if (!eventResult.success) {
    throw createValidationError(eventResult.error);
  }

  return eventResult.data;
};

export const validateBody = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  jsonBody: string,
): z.infer<typeof schema> => {
  let body;
  try {
    body = JSON.parse(jsonBody);
  } catch (e: unknown) {
    throw new AppError(
      ErrorCode.INVALID_PAYLOAD_FORMAT,
      'Payload format is incorrect. ',
    );
  }

  const bodyResult = schema.safeParse(body);

  if (!bodyResult.success) {
    throw createValidationError(bodyResult.error);
  }

  return bodyResult.data;
};

export const validateEventPathParameters = (
  event: APIGatewayEvent,
): EventWithPathParams => {
  const eventResult = EventWithPathParamSchema.safeParse(event);

  if (!eventResult.success) {
    throw new AppError(
      ErrorCode.INVALID_PATH_PARAMETER,
      `Invalid or missing parameters. Details: ${eventResult.error.message}}`,
    );
  }

  return eventResult.data;
};

type RelevantIssueCodes =
  | typeof ZodIssueCode.too_big
  | typeof ZodIssueCode.too_small;

const isRelevantError = (code: ZodIssueCode): code is RelevantIssueCodes => {
  return code === ZodIssueCode.too_big || code === ZodIssueCode.too_small;
};

const createValidationError = (error: z.ZodError): AppError => {
  const errorDetails = error.errors.map((e) => e.message).join(', ');

  const hasInvalidValue = error.errors.some((err) => isRelevantError(err.code));

  if (hasInvalidValue) {
    return new AppError(
      ErrorCode.INVALID_PAYLOAD_VALUE,
      `Invalid value in the request payload. Details: ${errorDetails}`,
    );
  } else {
    return new AppError(
      ErrorCode.INVALID_PAYLOAD_FORMAT,
      `Payload format is incorrect. Details: ${errorDetails}`,
    );
  }
};
