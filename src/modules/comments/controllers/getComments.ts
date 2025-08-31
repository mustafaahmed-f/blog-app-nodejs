import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { postSlug, cursor, limit } = req.query;
    if (!postSlug)
      return next(
        new Error("Post slug, startAfter and isFirstPage are required.")
      );

    const take = limit ? parseInt(limit.toString()) : 10;

    const comments = await prisma.comment.findMany({
      //// Cursor is used ot specify the row from which we start our query
      cursor: cursor ? { id: cursor.toString() } : undefined,
      take: take + 1,
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
            password: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Check if there's another page
    const hasMore = comments.length > take;
    comments.pop();

    const commentsCount = await prisma.comment.count({
      where: {
        postSlug: postSlug.toString(),
      },
    });

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
    return next(new Error(handlePrismaError(error).message));
  }
}
