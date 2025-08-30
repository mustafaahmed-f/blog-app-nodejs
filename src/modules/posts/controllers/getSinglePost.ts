import { NextFunction, Request, Response } from "express";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";

export async function getSinglePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postSlug = req.params.slug;
    const result = await prisma.post.findUnique({
      where: {
        slug: postSlug,
      },
      omit: {
        id: true,
      },
      include: {
        tags: {
          omit: {
            id: true,
          },
        },
      },
    });

    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "fetched"),
        data: result,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
