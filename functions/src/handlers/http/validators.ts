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

const VALUE_RELATED_ISSUE_CODES = [
  ZodIssueCode.too_big,
  ZodIssueCode.too_small,
] as const;

// NOTE: 定数から型を生成
type ValueRelatedIssueCodes = (typeof VALUE_RELATED_ISSUE_CODES)[number];

const isValueRelatedError = (
  code: ZodIssueCode,
): code is ValueRelatedIssueCodes => {
  return VALUE_RELATED_ISSUE_CODES.some(
    (relevantCode) => relevantCode === code,
  );
};

const createValidationError = (error: z.ZodError): AppError => {
  const errorDetails = error.errors.map((e) => e.message).join(', ');

  for (const err of error.errors) {
    if (isValueRelatedError(err.code)) {
      return new AppError(
        ErrorCode.INVALID_PAYLOAD_VALUE,
        `Invalid value in the request payload. Details: ${errorDetails}`,
      );
    }
  }

  return new AppError(
    ErrorCode.INVALID_PAYLOAD_FORMAT,
    `Payload format is incorrect. Details: ${errorDetails}`,
  );
};
