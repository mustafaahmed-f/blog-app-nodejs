import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";

export async function incViews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postSlug = req.params.slug;
    if (!postSlug) return next(new Error("Post slug is required."));

    const modifiedPost = await prisma.post.update({
      data: {
        views: { increment: 1 },
      },
      where: {
        slug: postSlug,
      },
      omit: {
        id: true,
      },
    });

    //todo : check featured posts in redis

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "updated"),
        data: modifiedPost,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
