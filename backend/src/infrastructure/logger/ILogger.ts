export interface ILogger {
  info(message: string): void;
  error(message: string, error?: unknown): void;
  warn(message: string): void;
  debug(message: string): void;
  http?(message: string): void;
}
