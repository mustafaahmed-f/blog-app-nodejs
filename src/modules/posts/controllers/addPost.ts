import { NextFunction, Request, Response } from "express";
import z from "zod";
import { prisma } from "../../../services/prismaClient.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { addPostSchema } from "../validations/addPost.validation.js";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

type newPost = z.infer<typeof addPostSchema>;

export async function addPost(req: Request, res: Response, next: NextFunction) {
  try {
    const newPost: newPost = req.body;
    const tagsArr = newPost.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase());

    //Todo : use email and userName add from req.user after using clerk:
    const userEmail = "mostafa@gmail.com";
    const userName = "mustafaAhmed";

    const slug = newPost.title.trim().split(" ").join("-") + "-" + userName;

    //// Purify the sent html :
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window as any);
    const clean = DOMPurify.sanitize(newPost.html);

    const result = await prisma.post.create({
      data: {
        ...newPost,
        slug: slug,
        userEmail,
        html: clean,
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
