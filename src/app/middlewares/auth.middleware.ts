import { Request, Response, NextFunction } from "express";
import { LoggerService } from "../../shared/logger";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    LoggerService.info("[AuthMiddleware] Request lacks authorization header, proceeding with default guest context.");
  }
  next();
};
