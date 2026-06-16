export class LoggerService {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  public static info(message: string, ...args: any[]): void {
    console.info(this.formatMessage("info", message), ...args);
  }

  public static warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage("warn", message), ...args);
  }

  public static error(message: string, error?: any, ...args: any[]): void {
    console.error(this.formatMessage("error", message), error || "", ...args);
  }

  public static debug(message: string, ...args: any[]): void {
    console.debug(this.formatMessage("debug", message), ...args);
  }
}
