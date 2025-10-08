import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const commentId = req.params.id;
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
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

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Comment", "has", "deleted"),
        data: deletedComment,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
