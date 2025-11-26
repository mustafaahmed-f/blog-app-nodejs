import { getAuth } from "@clerk/express";
import createDOMPurify from "dompurify";
import { NextFunction, Request, Response } from "express";
import { JSDOM } from "jsdom";
import z from "zod";
import { prisma } from "../../../services/prismaClient.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { uploadToCloudinary } from "../../../utils/helperMethods/uploadToCloudinary.js";
import { uploadPostImages } from "../utils/uploadPostImages.js";
import { addPostSchema } from "../validations/addPost.validation.js";
import { removeUploadedImages } from "../utils/removeUploadedImages.js";
import { removeImgKeysFromRedis } from "../utils/removeImgKeysFromRedis.js";
import { checkIdAndUser } from "../../../utils/helperMethods/checkIdAndUser.js";

type newPost = z.infer<typeof addPostSchema>;

export async function addPost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await checkIdAndUser(req);

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

    //// Remove removed photos by user
    const removedImages: string[] = JSON.parse(newPost.deletedIds);
    if (removedImages.length > 0) {
      await removeUploadedImages(removedImages);
      await removeImgKeysFromRedis(removedImages, newPost.draftId);
    }

    //// Creating new post:
    const result = await prisma.post.create({
      data: {
        draftId: newPost.draftId,

        title: newPost.title,

        categoryId: newPost.categoryId,
        slug: slug,

        img: secure_url,
        img_publicId: public_id,

        userEmail,

        delta: newPost.delta,
        desc: newPost.desc,
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

/*

📌 Summary of What to Test (Final Checklist)
*PRE-CONDITIONS

User not authenticated (checkIdAndUser throws)

User authenticated but not found

Missing file → returns 400

*SANITIZATION

HTML sanitized and passed to Prisma

*CLOUDINARY

Successful upload used in prisma data

Upload failure → next(error), stop everything else

*DELETED IMAGES

RemovedImages array > 0 → cleanup functions called

RemovedImages array empty → cleanup NOT called

*PRISMA

Correct slug calculation

Correct fields being passed

Tags mapped to connectOrCreate

Correct returned JSON response

*AFTER CREATION

Calls uploadPostImages(draftId)

*ERROR HANDLING

Prisma error → handled and passed to next()

*/
