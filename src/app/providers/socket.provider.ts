import { Server as HttpServer } from "http";
import { LoggerService } from "../../shared/logger";

export class SocketProvider {
  private static io: any = null;

  public static initialize(server: HttpServer): any {
    LoggerService.info("Socket.io initialization skipped (ready to mount event loops on demand).");
    return null;
  }

  public static getIO(): any {
    return this.io;
  }
}
