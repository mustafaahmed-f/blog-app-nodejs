import { NextFunction, Request, Response } from "express";

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
  } catch (error) {
    return next(new Error(`Error: ${error}`));
  }
}
