import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { redisClientInstance } from "../../../services/redisClient.js";
import { featuredPostsSetName } from "../utils/featuredPostsSet.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function getFeaturedPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const redisClient = redisClientInstance();
    const featuredPostFromRedis = await redisClient.zRange(
      featuredPostsSetName,
      0,
      0,
      {
        BY: "SCORE",
        REV: true,
      }
    );

    const featuredPost = await prisma.post.findUnique({
      where: {
        id: featuredPostFromRedis[0],
      },
    });

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "fetched"),
        data: featuredPost,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
