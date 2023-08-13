import { logger } from '../../common/logger';

// NOTE: 現状の動的に関数名を取得する方法はミニフィケーションや難読化に対応できない
export const useCaseFactory = <P, T>(
  executeLogic: (params: P) => Promise<T>,
  processError: (error: Error) => Error,
): ((params: P) => Promise<T>) => {
  return async (params: P) => {
    try {
      logger.info(`Start ${executeLogic.name}`);
      const handlerResult = await executeLogic(params);
      logger.info(`End ${executeLogic.name}`);
      return handlerResult;
    } catch (e: any) {
      logger.error(`Error in ${executeLogic.name}`, e);
      const errorResult = processError(e);
      logger.info(`Error response from ${processError.name}`, {
        result: errorResult,
      });
      throw errorResult;
    }
  };
};
