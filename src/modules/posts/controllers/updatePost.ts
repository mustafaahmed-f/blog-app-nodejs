import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../services/prismaClient.js";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";
import z from "zod";
import { updatePostSchema } from "../validations/updatePost.validation.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";

type updatedPost = z.infer<typeof updatePostSchema>;

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post: updatedPost = req.body;
    const postSlug = req.params.slug;

    let tagsArr: any = null;
    let newSlug: string | null = null;

    //Todo : use userName from req.user after using clerk:
    const userName = "mustafaAhmed";

    //// check if title is sent so create new slug
    if (post.title) {
      newSlug = post.title.trim().split(" ").join("-") + "-" + userName;
    }

    //// check if tags changed , create tags arr and apply connectOrCreate
    if (post.tags) {
      tagsArr = await Promise.all(
        post.tags.split(",").map((tag) => {
          return prisma.tag.upsert({
            where: {
              name: tag,
            },
            update: {},
            create: {
              name: tag,
            },
          });
        })
      );
    }

    const updatedPost = await prisma.post.update({
      where: {
        slug: postSlug,
      },
      data: {
        ...post,
        slug: newSlug ? newSlug : undefined,
        updatedAt: new Date(),
        isEdited: true,
        tags: !tagsArr
          ? undefined
          : {
              set: tagsArr.map((tag: any) => ({ id: tag.id })),
            },
      },
      omit: {
        id: true,
      },
      include: {
        tags: {
          omit: {
            id: true,
          },
        },
      },
    });

    return res.status(201).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "updated"),
        data: updatedPost,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
