import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    if ((req as any).validationErrorArr) {
      return res.status(err.cause || 500).json({
        message: "Validation Error",
        Error: (req as any).validationErrorArr,
      });
    }
    return res.status(err.cause || 400).json({ errMsg: err.message });
  }
};
