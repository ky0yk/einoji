import { logger } from '../../common/logger';

type UseCase<P, T> = (params: P) => Promise<T>;
type UseCaseErrorHandler = (error: Error) => Error;

// NOTE: 現状の動的に関数名を取得する方法はミニフィケーションや難読化に対応できない
export const useCaseFactory = <P, T>(
  useCase: UseCase<P, T>,
  useCaseErrorHandler: UseCaseErrorHandler,
): UseCase<P, T> => {
  return async (params: P) => {
    try {
      return await useCaseHandlerWithLogging(useCase, params);
    } catch (e: unknown) {
      logger.error(`Error ${useCase.name}`, String(e));
      return await useCaseErrorHandlerWithLogging(useCaseErrorHandler, e);
    }
  };
};

const useCaseHandlerWithLogging = async <P, T>(
  logic: UseCase<P, T>,
  params: P,
): Promise<T> => {
  logger.info(`Start ${logic.name}`);
  const logicResult = await logic(params);
  logger.info(`End ${logic.name}`);
  return logicResult;
};

const useCaseErrorHandlerWithLogging = async <T>(
  processError: UseCaseErrorHandler,
  e: unknown,
): Promise<T> => {
  if (e instanceof Error) {
    logger.info(`Start ${processError.name}`);
    const errorResult = processError(e);
    logger.info(`End ${processError.name}`, errorResult);

    throw errorResult;
  } else {
    logger.info(`unexpected error occurred: ${processError.name}}`);
    throw new Error('Unknown error');
  }
};
