import { z } from 'zod';
import { ErrorCode } from '../../common/errors/error-codes';
import { USER_ERROR_MESSAGES } from '../../common/errors/error-messsages';
import { HttpStatus } from './http-status';

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

export const httpResponse = (status: HttpStatus) => ({
  withBody: (body: JsonSerializable): LambdaResponse => ({
    statusCode: status,
    body: JSON.stringify(body),
  }),
  withError: (errorCode: ErrorCode): LambdaResponse => ({
    statusCode: status,
    body: JSON.stringify({
      code: errorCode,
      message: USER_ERROR_MESSAGES[errorCode],
    }),
  }),
});
