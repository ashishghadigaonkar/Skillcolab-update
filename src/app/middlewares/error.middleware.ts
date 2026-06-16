import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors";
import { LoggerService } from "../../shared/logger";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Internal Server Error";

  LoggerService.error(`[ErrorMiddleware] ${statusCode} - ${message}`, err);

  res.status(statusCode).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack, errors: err.errors })
  });
};
