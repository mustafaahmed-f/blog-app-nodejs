import { NextFunction, Request, Response } from "express";
import z from "zod";
import { prisma } from "../../../services/prismaClient.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { addPostSchema } from "../validations/addPost.validation.js";

type updatedPost = z.infer<typeof addPostSchema>;

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post: updatedPost = req.body;
    const postSlug = req.params.slug;
    let img: any = undefined;

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

    if (req.file?.buffer) {
      img = req?.file?.buffer;
      //todo : upload it on s3
    }

    const fakeImgURL =
      "https://storage.googleapis.com/fir-auth-1c3bc.appspot.com/1694290122808-71AL1tTRosL._SL1500_.jpg";

    const updatedPost = await prisma.post.update({
      where: {
        slug: postSlug,
      },
      data: {
        ...post,
        img: fakeImgURL,
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
