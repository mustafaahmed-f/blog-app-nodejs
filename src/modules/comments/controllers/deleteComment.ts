import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getAuth } from "@clerk/express";

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw new Error("UserId from clerk is not found!!");
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) throw new Error("User not found");

    const commentId = req.params.id;

    const postSlug = req.query.postSlug?.toString();
    if (!postSlug) return next(new Error("Post slug is required."));

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
        userEmail: user.email,
        postSlug,
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
