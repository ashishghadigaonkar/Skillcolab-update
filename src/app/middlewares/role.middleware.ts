import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
};
