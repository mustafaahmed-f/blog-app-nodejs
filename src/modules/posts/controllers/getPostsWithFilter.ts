import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

export async function getPostsWithFilter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const category = req.query.category?.toString();
    const tag = req.query.tag?.toString();
    const userEmail = req.query.userEmail?.toString();

    const filters = [category, tag, userEmail].filter(Boolean);

    if (!filters.length)
      return res.status(400).json({ error: "No filter provided" });
    if (filters.length > 1) {
      return res.status(400).json({ error: "Only one filter is allowed" });
    }

    const result = await prisma.post.findMany({
      where: {
        categoryId: category ? category : undefined,
        tags: tag
          ? {
              some: {
                name: tag,
              },
            }
          : undefined,
        userEmail: userEmail ? userEmail : undefined,
      },
      include: {
        _count: {
          select: {
            comments: true,
            Likes: true,
          },
        },
        tags: {
          omit: {
            id: true,
          },
        },
        cat: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        user: {
          omit: {
            id: true,
            password: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "have", "fetched"),
        data: result,
        additionalInfo: {
          filterResults: result.length,
        },
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
