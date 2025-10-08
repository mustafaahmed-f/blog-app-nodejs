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
      9,
      {
        REV: true,
      }
    );

    const featuredPosts = await Promise.all(
      featuredPostFromRedis.map(async (post) => {
        return await prisma.post.findUnique({
          where: {
            id: post,
          },
          include: {
            tags: {},
            user: {
              omit: {
                id: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            cat: {},
          },
          omit: {
            id: true,
          },
        });
      })
    );

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "fetched"),
        data: featuredPosts,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
