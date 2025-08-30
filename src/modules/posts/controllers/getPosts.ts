import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../services/prismaClient.js";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { pagination } from "../../../utils/helperMethods/pagination.js";

export async function getPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { page, size } = req.query;
  const { take, skip } = pagination({
    page: parseInt((page as string) ?? "1"),
    size: parseInt((size as string) ?? "10"),
  });
  const posts = await prisma.post.findMany({
    take,
    skip,
  });

  if (!posts.length)
    return next(new Error(getErrorMsg("Post", "were", "notFound")));

  return res.status(200).json(
    getJsonResponse({
      data: posts,
      message: getSuccessMsg("Post", "have", "fetched"),
    })
  );
}
