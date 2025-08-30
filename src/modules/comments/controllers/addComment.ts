import { NextFunction, Request, Response } from "express";
import z from "zod";
import { addCommentSchema } from "../validations/addComment.validation.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

type newComment = z.infer<typeof addCommentSchema>;
export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comment: newComment = req.body;
    const postSlug = req.query.postSlug?.toString();
    if (!postSlug) return next(new Error("Post slug is required."));
    //Todo : use email add from req.user after using clerk:
    const userEmail = "mostafa@gmail.com";
    const newComment = await prisma.comment.create({
      data: {
        desc: comment.desc,
        userEmail,
        postSlug,
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
        post: {
          omit: {
            id: true,
          },
        },
      },
    });
    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Comment", "has", "created"),
        data: newComment,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
