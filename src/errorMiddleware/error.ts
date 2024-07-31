import { NextFunction, Request, Response } from "express";

export class ErrorHandler extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.status = status;
  }
}

export const errorMiddleware = async (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status ?? 500;
  const message = err.message ?? "Internal Error !";
  return res.status(status).json({ success: false, message });
};
