import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../services/prismaClient.js";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";
import z from "zod";
import { updatePostSchema } from "../validations/updatePost.validation.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";

type updatedPost = z.infer<typeof updatePostSchema>;

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post: updatedPost = req.body;
    const postSlug = req.params.slug;
    const checkPostExistence = await prisma.post.findUnique({
      where: {
        slug: postSlug,
      },
      include: {
        tags: {
          omit: {
            id: true,
          },
        },
      },
    });

    if (!checkPostExistence)
      return next(new Error(getErrorMsg("Post", "was", "notFound")));

    let tagsArr: string[] | null = null;
    let newSlug: string | null = null;

    //// check if title is sent so create new slug
    if (post.title) {
      newSlug = post.title.trim().split(" ").join("-");
    }

    //// check if tags changed , create tags arr and apply connectOrCreate
    if (post.tags) {
      tagsArr = post.tags.split(",").map((tag) => tag.trim().toLowerCase());
    }

    const updatedPost = await prisma.post.update({
      where: {
        slug: postSlug,
      },
      data: {
        ...post,
        slug: newSlug ? newSlug : undefined,
        tags: !tagsArr
          ? undefined
          : {
              connectOrCreate: tagsArr.map((tag) => {
                return {
                  where: {
                    name: tag,
                  },
                  create: {
                    name: tag,
                  },
                };
              }),
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
    return next(new Error(`Error: ${error}`));
  }
}
