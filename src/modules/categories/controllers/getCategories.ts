import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await prisma.category.findMany({});

    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Category", "have", "fetched"),
        data: categories,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
