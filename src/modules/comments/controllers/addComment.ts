import { NextFunction, Request, Response } from "express";
import z from "zod";
import { addCommentSchema } from "../validations/addComment.validation.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getAuth } from "@clerk/express";

type newComment = z.infer<typeof addCommentSchema>;
export async function addComment(
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

    const postSlug = req.query.postSlug?.toString();
    if (!postSlug) return next(new Error("Post slug is required."));

    const comment: newComment = req.body;

    const newComment = await prisma.comment.create({
      data: {
        desc: comment.desc,
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
