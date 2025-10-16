import { NextFunction, Request, Response } from "express";
import z from "zod";
import { prisma } from "../../../services/prismaClient.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { addPostSchema } from "../validations/addPost.validation.js";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import { AuthObject, clerkClient, getAuth } from "@clerk/express";

type newPost = z.infer<typeof addPostSchema>;

export async function addPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw new Error("UserId from clerk is not found!!");
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) throw new Error("User not found");

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newPost: newPost = req.body;
    const tagsArr = newPost.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase());

    const userEmail = user?.email ?? "";
    const userName = user?.userName ?? "";

    const slug = newPost.title.trim().split(" ").join("-") + "-" + userName;

    //// Purify the sent html :
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window as any);
    const clean = DOMPurify.sanitize(newPost.html);

    //// Get image :
    const image = req?.file?.buffer;
    //todo : upload it on s3

    const fakeImgURL =
      "https://storage.googleapis.com/fir-auth-1c3bc.appspot.com/1694290122808-71AL1tTRosL._SL1500_.jpg";

    const result = await prisma.post.create({
      data: {
        ...newPost,
        img: fakeImgURL, // todo : add img url after uploading it to amazon s3
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
