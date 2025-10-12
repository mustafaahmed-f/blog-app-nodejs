import { NextFunction, Request, Response } from "express";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { getAuth } from "@clerk/express";

export async function getSinglePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = getAuth(req);
    let user: any = null;
    user =
      userId &&
      (await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      }));

    const userEmail = user?.email ?? "";

    const postSlug = req.params.slug;
    if (!postSlug) return next(new Error("Post slug is required."));
    let userLikedPost: any = null;
    const result = await prisma.post.findUnique({
      where: {
        slug: postSlug,
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
