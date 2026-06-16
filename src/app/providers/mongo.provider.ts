import { MongoDBService } from "../../services/mongodbService";
import { LoggerService } from "../../shared/logger";

export class MongoProvider {
  public static async connect(): Promise<void> {
    try {
      LoggerService.info("Initializing MongoDB Atlas connection stream...");
      await MongoDBService.getInstance().connect();
    } catch (err: any) {
      if (
        err?.message?.includes("ECONNREFUSED") || 
        err?.name === "MongooseServerSelectionError" || 
        err?.message?.includes("MongooseServerSelectionError")
      ) {
        LoggerService.warn("Offline database mode: Local MongoDB is offline. Server operates stably using full file-based dbState mock fallbacks.");
      } else {
        LoggerService.error("MongoDB Connection pool deferred:", err);
      }
    }
  }
}
