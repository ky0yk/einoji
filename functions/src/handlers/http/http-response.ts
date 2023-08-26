import { z } from 'zod';
import { ErrorCode } from '../../common/errors/error-codes';
import { ERROR_RESPONSE_MAP } from './error-response-map';

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

export const httpResponse = (status: number): WithBodyResponseGenerator => {
  return {
    withBody: (body: JsonSerializable) => ({
      statusCode: status,
      body: JSON.stringify(body),
    }),
  };
};

export const httpErrorResponse = (errorCode: ErrorCode): LambdaResponse => {
  return {
    statusCode: ERROR_RESPONSE_MAP[errorCode].statusCode,
    body: JSON.stringify({
      code: ERROR_RESPONSE_MAP[errorCode].userErrorCode,
      message: ERROR_RESPONSE_MAP[errorCode].message,
    }),
  };
};
