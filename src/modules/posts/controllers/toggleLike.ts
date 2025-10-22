import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getAuth } from "@clerk/express";
import { checkIdAndUser } from "../../../utils/helperMethods/checkIdAndUser.js";

export async function toggleLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await checkIdAndUser(req);

    const userEmail = user?.email ?? "";

    const postSlug = req.query.postSlug?.toString();

    if (!postSlug) return next(new Error("Post slug is required."));

    const existence = await prisma.likes.findUnique({
      where: {
        userEmail_postSlug: {
          userEmail,
          postSlug,
        },
      },
    });

    if (!existence) {
      await prisma.likes.create({
        data: {
          userEmail,
          postSlug,
        },
      });

      return res.status(200).json(
        getJsonResponse({
          message: "Liked",
        })
      );
    } else {
      await prisma.likes.delete({
        where: {
          userEmail_postSlug: {
            userEmail,
            postSlug,
          },
        },
      });
      return res.status(200).json(
        getJsonResponse({
          message: "Disliked",
        })
      );
    }
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
