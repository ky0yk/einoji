import { ZodIssueCode, ZodSchema, ZodType, z } from 'zod';
import { AppError } from '../../utils/errors/app-errors';
import { ErrorCode } from '../../utils/errors/error-codes';
import { APIGatewayEvent } from 'aws-lambda';

export const validateBody = <T>(
  bodySchema: ZodSchema<T>,
  event: APIGatewayEvent,
): T => {
  let parsedBody: T;
  try {
    parsedBody = JSON.parse(event.body!);
  } catch (error) {
    throw new AppError(
      ErrorCode.INVALID_PAYLOAD_FORMAT,
      'Failed to parse the request body.',
    );
  }

  const parsedResult = bodySchema.safeParse(parsedBody);
  if (!parsedResult.success) {
    throw createValidationError(parsedResult.error);
  }

  return parsedResult.data;
};

export const validatePathParams = <T>(
  pathParamsSchema: ZodSchema<T>,
  event: APIGatewayEvent,
): T => {
  if (!event.pathParameters) {
    throw new AppError(
      ErrorCode.INVALID_PATH_PARAMETER,
      'Path parameters are missing.',
    );
  }

  const parsedResult = pathParamsSchema.safeParse(event.pathParameters);

  if (!parsedResult.success) {
    throw new AppError(
      ErrorCode.INVALID_PATH_PARAMETER,
      'Path parameters are invalid.',
    );
  }

  return parsedResult.data;
};

type BodyAndPathParams<T, U> = {
  body: T;
  pathParameters: U;
};
export const validateBodyAndPathParams = <T, U>(
  event: APIGatewayEvent,
  bodySchema: ZodType<T>,
  pathParamsSchema: ZodType<U>,
): BodyAndPathParams<T, U> => {
  const body = validateBody(bodySchema, event);
  const pathParams = validatePathParams(pathParamsSchema, event);

  return {
    body: body,
    pathParameters: pathParams,
  };
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

  const isValueError = error.errors.some((err) =>
    isValueRelatedError(err.code),
  );

  const errorCode = isValueError
    ? ErrorCode.INVALID_PAYLOAD_VALUE
    : ErrorCode.INVALID_PAYLOAD_FORMAT;
  const errorMessage = isValueError
    ? `Invalid value in the request payload. Details: ${errorDetails}`
    : `Payload format is incorrect. Details: ${errorDetails}`;

  return new AppError(errorCode, errorMessage);
};
