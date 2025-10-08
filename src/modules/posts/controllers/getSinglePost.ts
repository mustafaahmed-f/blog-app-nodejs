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
    if (!postSlug) return next(new Error("Post slug is required."));
    //todo : try to get userEmail using clerk;
    const userEmail = req.query.userEmail?.toString();
    let userLikedPost: any = null;
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
        _count: {
          select: {
            comments: true,
            Likes: true,
          },
        },
        user: {
          omit: {
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        cat: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (userEmail) {
      userLikedPost = await prisma.likes.findUnique({
        where: {
          userEmail_postSlug: {
            userEmail,
            postSlug,
          },
        },
      });
    }

    if (!result) return next(new Error(getErrorMsg("Post", "was", "notFound")));

    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "fetched"),
        data: result,
        additionalInfo: {
          userLikedPost: !!userLikedPost,
        },
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
