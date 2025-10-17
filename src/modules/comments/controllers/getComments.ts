import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";

export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { postSlug, cursor, limit } = req.query;
    if (!postSlug) return next(new Error("Post slug is required."));

    const take = limit ? parseInt(limit.toString()) : 10;

    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug.toString(),
      },
    });

    if (!post) return next(new Error(getErrorMsg("Post", "was", "notFound")));

    const comments = await prisma.comment.findMany({
      //// Cursor is used ot specify the row from which we start our query
      cursor: cursor ? { id: cursor.toString() } : undefined,
      take,
      skip: cursor ? 1 : 0, //// if we have cursor so we skip it because it is the id of the last element
      where: {
        postSlug: postSlug.toString(),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          omit: {
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const commentsCount = await prisma.comment.count({
      where: {
        postSlug: postSlug.toString(),
      },
    });

    if (!comments.length) {
      return res.status(200).json(
        getJsonResponse({
          message: getErrorMsg("Comment", "were", "notFound"),
          data: comments,
          additionalInfo: {
            commentsCount,
            hasMore: false,
            nextCursor: null,
            fetchedComments: comments.length,
          },
        })
      );
    }

    const lastComment = await prisma.comment.findFirst({
      where: { postSlug: postSlug.toString() },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    const isLastCursor =
      commentsCount === comments.length
        ? true
        : comments[comments.length - 1].id === lastComment?.id;
    const hasMore = !isLastCursor;

    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Comment", "have", "fetched"),
        data: comments,
        additionalInfo: {
          commentsCount,
          hasMore,
          nextCursor: hasMore ? comments[comments.length - 1].id : null,
          fetchedComments: comments.length,
        },
      })
    );
  } catch (error) {
    console.log("Error in getComments:", error);
    return next(new Error(handlePrismaError(error).message));
  }
}
