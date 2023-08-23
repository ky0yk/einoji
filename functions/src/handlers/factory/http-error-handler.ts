import { AppError } from '../../common/app-errors';
import {
  ERROR_HTTP_STATUS_CODES,
  USER_ERROR_MESSAGES,
} from '../../common/error-codes';
import { LambdaResponse, httpResponse } from '../http/http-response';

export const httpErrorHandler = (error: AppError): LambdaResponse => {
  const errorCode = error.code;
  const httpStatusCode = ERROR_HTTP_STATUS_CODES[errorCode];
  const userErrorMessage = USER_ERROR_MESSAGES[errorCode];

  return httpResponse(httpStatusCode).withBody({
    code: errorCode,
    message: userErrorMessage,
  });
};
