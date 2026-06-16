import { Request, Response, NextFunction } from "express";

export const validationMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
};
