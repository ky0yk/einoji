import { AppError } from '../../common/errors/app-errors';
import { LambdaResponse, httpErrorResponse } from '../http/http-response';

export const httpErrorHandler = (error: AppError): LambdaResponse => {
  return httpErrorResponse(error.code);
};
