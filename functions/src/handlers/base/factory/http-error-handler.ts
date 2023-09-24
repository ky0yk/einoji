import { AppError } from '../../../utils/errors/app-errors';
import { LambdaResponse, httpErrorResponse } from '../http/http-response';

export const httpErrorHandler = (error: AppError): LambdaResponse => {
  return httpErrorResponse(error);
};
