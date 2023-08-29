import { z } from 'zod';
import { HttpStatus } from './http-status';
import { AppError } from '../../common/errors/app-errors';
import { errorCodetoStatus } from '../../common/errors/error-codes';

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

export const httpErrorResponse = (error: AppError): LambdaResponse => {
  const status = errorCodetoStatus(error.code);

  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: error.code,
      message: error.message,
    }),
  };
};
