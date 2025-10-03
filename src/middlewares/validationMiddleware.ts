import { NextFunction, Request, Response } from "express";
import z from "zod";

export function validationMiddleware(validaitonSchema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const result = validaitonSchema.safeParse(req.body);
      if (!result.success) {
        (req as any).validationErrorArr = z.treeifyError(result.error);
        return next(new Error(""));
      } else {
        return next();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        (req as any).validationErrorArr = error.issues;
        return next(error.issues);
      }
      return next(error);
    }
  };
}
