import { ILogger } from "./ILogger";
import { loggerInstance } from "./Logger";

export class WinstonLogger implements ILogger {
  info(message: string): void {
    loggerInstance.info(message);
  }
  error(message: string, error?: unknown): void {
    loggerInstance.error(`${message} - ${error instanceof Error ? error.stack : error}`);
  }
  warn(message: string): void {
    loggerInstance.warn(message);
  }
  debug(message: string): void {
    loggerInstance.debug(message);
  }
  http(message: string): void {
    loggerInstance.http?.(message);
  }
}
