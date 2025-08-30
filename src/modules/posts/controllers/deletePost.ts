import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postSlug: string = req.params.slug;

    const deletedPost = await prisma.post.delete({
      where: {
        slug: postSlug,
      },
      omit: {
        id: true,
      },
      include: {
        tags: {},
      },
    });

    await prisma.tag.deleteMany({
      where: {
        AND: [
          {
            posts: {
              none: {},
            },
          },
          {
            id: {
              in: deletedPost.tags.map((tag) => tag.id ?? []),
            },
          },
        ],
      },
    });

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "deleted"),
        data: deletedPost,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
