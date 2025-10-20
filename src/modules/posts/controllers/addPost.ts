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
import cloudinary from "../../../services/cloudinary.js";
import { uploadToCloudinary } from "../../../utils/helperMethods/uploadToCloudinary.js";
import { redisClientInstance } from "../../../services/redisClient.js";
import { getKeysFromRedis } from "../../../utils/helperMethods/getKeysFromRedis.js";
import { uploadPostImages } from "../utils/uploadPostImages.js";

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

    //// Uploading main image :
    let secure_url = "",
      public_id = "";

    const folder = `${process.env.CLOUDINARY_FOLDER}/Posts/${newPost.draftId}`;

    try {
      const uploadResponse = await uploadToCloudinary(req.file.buffer, folder);

      secure_url = uploadResponse.secure_url;
      public_id = uploadResponse.public_id;
    } catch (err) {
      //todo : add a try and catch for uploading the image and in catch use rabbitMQ to publish a message to retry uploading
      console.error("Cloudinary upload failed:", err);
      return next(new Error("Failed to upload image to Cloudinary."));
    }

    //// Creating new post:
    const result = await prisma.post.create({
      data: {
        ...newPost,
        img: secure_url,
        img_publicId: public_id,
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

    //// uploading post images :
    //todo : for looping over redis keys and adding post images, we will use rabbitMQ latter to allow faster respose in case of
    //todo : large number of images uploaded.

    await uploadPostImages(newPost.draftId);

    return res.json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "created"),
        data: result,
      })
    );
  } catch (error) {
    console.log(error);
    return next(new Error(handlePrismaError(error).message));
  }
}
