import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import z from "zod";
import { prisma } from "../../../services/prismaClient.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { addCommentSchema } from "../validations/addComment.validation.js";

type updatedComment = z.infer<typeof addCommentSchema>;
export async function updateComment(
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

    const comment: updatedComment = req.body;
    const commentId = req.params.id;

    const postSlug = req.query.postSlug?.toString();
    if (!postSlug) return next(new Error("Post slug is required."));

    const result = await prisma.comment.update({
      data: comment,
      where: {
        postSlug,
        id: commentId,
        userEmail: user.email,
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

    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Comment", "has", "updated"),
        data: result,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
