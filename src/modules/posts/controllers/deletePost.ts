import { NextFunction, Request, Response } from "express";

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postSlug: string = req.params.slug;
  } catch (error) {
    return next(new Error(`Error: ${error}`));
  }
}
