import { Logger } from '@aws-lambda-powertools/logger';
export const logger = new Logger();

type LoggingLayer = 'handler' | 'usecase' | 'infra';
type LoggingAction = 'ENTRY' | 'EXIT';

const log = (layer: LoggingLayer, action: LoggingAction, name: string) =>
  logger.info(`${action} ${layer}: ${name}`);

const createLayerSpecificLogger = (layer: LoggingLayer) => {
  return (action: LoggingAction, name: string) => {
    log(layer, action, name);
  };
};

const logError = (
  layer: LoggingLayer,
  action: LoggingAction,
  name: string,
  error?: unknown,
) => logger.error(`${action} error in ${layer}: ${name}`, String(error));

const createLayerSpecificErrorLogger = (layer: LoggingLayer) => {
  return (action: LoggingAction, name: string, error?: unknown) => {
    logError(layer, action, name, error);
  };
};

type LoggerFunctions = {
  log: (action: LoggingAction, name: string) => void;
  logError: (action: LoggingAction, name: string, error?: unknown) => void;
};

export const createLoggerFunctionsForLayer = (
  layer: LoggingLayer,
): LoggerFunctions => {
  return {
    log: createLayerSpecificLogger(layer),
    logError: createLayerSpecificErrorLogger(layer),
  };
};
