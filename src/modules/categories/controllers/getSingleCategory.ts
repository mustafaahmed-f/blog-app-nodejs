import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function getSingleCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = req.params.category.toString();
    if (!category) return next(new Error("Category slug is required."));
    const result = await prisma.category.findFirst({
      where: {
        title: {
          equals: category,
        },
      },
    });

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Category", "has", "fetched"),
        data: result,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
