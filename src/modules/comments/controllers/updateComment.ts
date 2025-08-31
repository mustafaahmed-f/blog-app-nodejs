import { NextFunction, Request, Response } from "express";
import z from "zod";
import { updateCommentSchema } from "../validations/updateComment.validation.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

type updatedComment = z.infer<typeof updateCommentSchema>;
export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comment: updatedComment = req.body;
    const commentId = req.params.id;
    const postSlug = req.query.postSlug?.toString();
    if (!postSlug) return next(new Error("Post slug is required."));
    //Todo : use email add from req.user after using clerk:
    const userEmail = "mostafa@gmail.com";

    if (!comment.desc?.length)
      return next(new Error("Comment can't be empty !!"));

    const result = await prisma.comment.update({
      data: comment,
      where: {
        postSlug,
        id: commentId,
        userEmail,
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
