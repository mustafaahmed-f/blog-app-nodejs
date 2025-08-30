import { NextFunction, Request, Response } from "express";
import z from "zod";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { addPostSchema } from "../validations/addPost.validation.js";
import { prisma } from "../../../services/prismaClient.js";
import { getErrorMsg } from "../../../utils/helperMethods/generateErrorMsg.js";

type newPost = z.infer<typeof addPostSchema>;

export async function addPost(req: Request, res: Response, next: NextFunction) {
  const newPost: newPost = req.body;
  // console.log("newPost", newPost);
  //// Check if same user has prev. post with the same title:
  //Todo : use email add from req.user after using clerk:
  const userEmail = "mostafa@gmail.com";
  const checkPostExistence = await prisma.post.findFirst({
    where: {
      AND: [
        {
          title: {
            equals: newPost.title,
          },
          userEmail: {
            equals: userEmail,
          },
        },
      ],
    },
  });

  if (checkPostExistence)
    return next(new Error("User can't add multiple posts with same title."));

  //TODO: check category existence

  const slug = newPost.title.trim().split(" ").join("-");

  const result = await prisma.post.create({
    data: { ...newPost, slug: slug, userEmail },
    omit: {
      id: true,
    },
  });

  try {
    return res.json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "created"),
        data: result,
      })
    );
  } catch (error) {
    return next(
      new Error(`${getErrorMsg("Post", "was", "notCreated")}. Error: ${error}`)
    );
  }
}
