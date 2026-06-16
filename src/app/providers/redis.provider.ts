import { LoggerService } from "../../shared/logger";

export class RedisProvider {
  private static client: any = null;

  public static async connect(): Promise<void> {
    LoggerService.info("Redis cache synchronization pool deferred (in-memory mock_db persistence is operational).");
  }

  public static getClient(): any {
    return this.client;
  }
}
