import { z } from 'zod';
import { HttpStatus } from './http-status';
import { AppError } from '../../utils/errors/app-errors';
import { errorCodetoStatus } from '../../utils/errors/error-codes';

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

const createResponse = (
  statusCode: HttpStatus,
  body?: JsonSerializable,
): LambdaResponse => {
  if (body) {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }
  return {
    statusCode,
  };
};

export const httpResponse = (
  statusCode: HttpStatus,
  body?: JsonSerializable,
): LambdaResponse => {
  return createResponse(statusCode, body);
};

export const httpErrorResponse = (error: AppError): LambdaResponse => {
  return createResponse(errorCodetoStatus(error.code), {
    code: error.code,
    message: error.message,
  });
};
