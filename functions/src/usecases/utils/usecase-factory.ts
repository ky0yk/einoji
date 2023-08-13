import { logger } from '../../common/logger';

type ExecuteLogic<P, T> = (params: P) => Promise<T>;
type ProcessError = (error: Error) => Error;

// NOTE: 現状の動的に関数名を取得する方法はミニフィケーションや難読化に対応できない
export const useCaseFactory = <P, T>(
  executeLogic: ExecuteLogic<P, T>,
  processError: ProcessError,
): ExecuteLogic<P, T> => {
  return async (params: P) => {
    try {
      logger.info(`Start ${executeLogic.name}`);
      const handlerResult = await executeLogic(params);
      logger.info(`End ${executeLogic.name}`);
      return handlerResult;
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error(`Error in ${executeLogic.name}`, e);
        const errorResult = processError(e);
        logger.info(`Error response from ${processError.name}`, {
          result: errorResult,
        });
        throw errorResult;
      } else {
        logger.error(`Error in ${executeLogic.name}`, new Error(String(e)));
        throw new Error('Unknown error');
      }
    }
  };
};
