import { AppError } from '../../common/errors/app-errors';
import { ERROR_HTTP_STATUS_CODES } from '../../common/errors/error-status-mapping';

import { LambdaResponse, httpResponse } from '../http/http-response';

export const httpErrorHandler = (error: AppError): LambdaResponse => {
  const errorCode = error.code;
  const httpStatusCode = ERROR_HTTP_STATUS_CODES[errorCode];
  return httpResponse(httpStatusCode).withError(errorCode);
};
