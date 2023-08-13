import { z } from 'zod';
import { ERROR_MESSAGES, ErrorCode } from '../../src/common/error-codes';

export const LambdaResponseSchema = z.object({
  statusCode: z.number(),
  body: z.string().optional(),
});

export type LambdaResponse = z.infer<typeof LambdaResponseSchema>;

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const httpResponse = (status: HttpStatus) => ({
  withBody: (body: any): LambdaResponse => ({
    statusCode: status,
    body: JSON.stringify(body),
  }),
  withError: (errorCode: ErrorCode): LambdaResponse => ({
    statusCode: status,
    body: JSON.stringify({ errorCode, message: ERROR_MESSAGES[errorCode] }),
  }),
});
