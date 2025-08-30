import { NextFunction, Request, Response } from "express";
import z from "zod";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { addPostSchema } from "../validations/addPost.validation.js";
import { prisma } from "../../../services/prismaClient.js";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";

type newPost = z.infer<typeof addPostSchema>;

export async function addPost(req: Request, res: Response, next: NextFunction) {
  try {
    const newPost: newPost = req.body;
    const tagsArr = newPost.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase());
    // console.log("newPost", newPost);
    //// Check if same user has prev. post with the same title:
    //Todo : use email and userName add from req.user after using clerk:
    const userEmail = "mostafa@gmail.com";
    const userName = "mustafaAhmed";

    //TODO: check category existence

    const slug = newPost.title.trim().split(" ").join("-") + "-" + userName;

    const result = await prisma.post.create({
      data: {
        ...newPost,
        slug: slug,
        userEmail,
        tags: {
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

    return res.json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "created"),
        data: result,
      })
    );
  } catch (error) {
    return next(new Error(handlePrismaError(error).message));
  }
}
