import { z } from 'zod';
import { ErrorCode } from '../../common/errors/error-codes';
import { HttpStatus } from './http-status';
import {
  USER_ERROR_MESSAGES,
  errorCodeToUserErrorCode,
  userErrorCodeToHttpStatus,
} from './user-error-mapping';

// NOTE: 現状application/json以外は扱わないので、Content-Typeは固定
export const LambdaResponseSchema = z.object({
  statusCode: z.number(),
  headers: z
    .object({
      'Content-Type': z.literal('application/json'),
    })
    .optional(),
  body: z.string().optional(),
});

export type LambdaResponse = z.infer<typeof LambdaResponseSchema>;

type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonSerializable }
  | JsonSerializable[];

type WithBodyResponseGenerator = {
  withBody: (body: JsonSerializable) => LambdaResponse;
};

export const httpResponse = (status: HttpStatus): WithBodyResponseGenerator => {
  return {
    withBody: (body: JsonSerializable) => ({
      statusCode: status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }),
  };
};

export const httpErrorResponse = (errorCode: ErrorCode): LambdaResponse => {
  const userErrorCode = errorCodeToUserErrorCode(errorCode);
  const statusCode = userErrorCodeToHttpStatus(userErrorCode);

  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: userErrorCode,
      message: USER_ERROR_MESSAGES[userErrorCode],
    }),
  };
};
