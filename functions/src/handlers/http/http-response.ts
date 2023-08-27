import { z } from 'zod';
import { ErrorCode } from '../../common/errors/error-codes';
import { HttpStatus } from './http-status';
import {
  USER_ERROR_MESSAGES,
  errorCodeToUserErrorCode,
  userErrorCodeToHttpStatus,
} from './user-error-mapping';

export const LambdaResponseSchema = z.object({
  statusCode: z.number(),
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
      body: JSON.stringify(body),
    }),
  };
};

export const httpErrorResponse = (errorCode: ErrorCode): LambdaResponse => {
  const userErrorCode = errorCodeToUserErrorCode(errorCode);
  const statusCode = userErrorCodeToHttpStatus(userErrorCode);

  return {
    statusCode: statusCode,
    body: JSON.stringify({
      code: userErrorCode,
      message: USER_ERROR_MESSAGES[userErrorCode],
    }),
  };
};
