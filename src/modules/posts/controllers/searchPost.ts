import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function searchPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const searchTerm = req.query.searchTerm?.toString();
    let posts = [];

    if (searchTerm && searchTerm?.length <= 3) {
      posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
              },
            },
            {
              desc: {
                contains: searchTerm,
              },
            },
          ],
        },
      });
    } else {
      posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                search: searchTerm,
              },
            },
            {
              desc: {
                search: searchTerm,
              },
            },
          ],
        },
      });
    }

    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "have", "fetched"),
        data: posts,
        additionalInfo: {
          searchResults: posts.length,
        },
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
