import { getAuth } from "@clerk/express";
import createDOMPurify from "dompurify";
import { NextFunction, Request, Response } from "express";
import { JSDOM } from "jsdom";
import z from "zod";
import { prisma } from "../../../services/prismaClient.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { updatePostSchema } from "../validations/updatePost.validation.js";
import { uploadToCloudinary } from "../../../utils/helperMethods/uploadToCloudinary.js";
import cloudinary from "../../../services/cloudinary.js";

type updatedPost = z.infer<typeof updatePostSchema>;

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Here 1");
    const { userId } = getAuth(req);
    if (!userId) throw new Error("UserId from clerk is not found!!");

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) throw new Error("User not found");

    const post: updatedPost = req.body;
    const postSlug = req.params.slug;

    if (!postSlug) return next(new Error("Post slug is required."));

    const checkPostExistence = await prisma.post.findUnique({
      where: {
        slug: postSlug,
      },
    });
    if (!checkPostExistence) return next(new Error("Post not found."));

    //// Get dirty fields array:
    const dirtyFieldsArr = post.dirtyFields
      .split(",")
      .map((field) => field.trim());

    let tagsArr: any = null;

    let newSlug: string | null = null;

    const userName = user.userName;

    //// check if title is sent so create new slug
    if (post.dirtyFields.includes("title")) {
      newSlug = post.title.trim().split(" ").join("-") + "-" + userName;
    }

    //// Purify the sent html :
    let clean = post.html;
    if (dirtyFieldsArr.includes("html")) {
      const window = new JSDOM("").window;
      const DOMPurify = createDOMPurify(window as any);
      clean = DOMPurify.sanitize(post.html);
    }

    //// check if tags changed , create tags arr and apply connectOrCreate
    if (dirtyFieldsArr.includes("tags")) {
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

    //// Get image :
    let secure_url = req.file && req.file.buffer ? "" : checkPostExistence.img,
      public_id =
        req.file && req.file.buffer ? "" : checkPostExistence.img_publicId;

    const folder = `${process.env.CLOUDINARY_FOLDER}/Posts/${post.draftId}`;

    if (req.file && req.file?.buffer) {
      try {
        const [_, uploadResponse] = await Promise.all([
          cloudinary.uploader.destroy(
            checkPostExistence.img_publicId as string
          ),
          uploadToCloudinary(req.file.buffer, folder),
        ]);

        secure_url = uploadResponse.secure_url;
        public_id = uploadResponse.public_id;
      } catch (err) {
        //todo : add a try and catch for uploading the image and in catch use rabbitMQ to publish a message to retry uploading
        console.error("Cloudinary upload failed:", err);
        return next(new Error("Failed to upload image to Cloudinary."));
      }
    }

    const updatedPost = await prisma.post.update({
      where: {
        slug: postSlug,
        userEmail: user.email,
      },
      data: {
        draftId: post.draftId,

        title: dirtyFieldsArr.includes("title") ? post.title : undefined,

        slug: newSlug ? newSlug : undefined,
        categoryId: dirtyFieldsArr.includes("categoryId")
          ? post.categoryId
          : undefined,
        img: secure_url,
        img_publicId: public_id,

        updatedAt: new Date(),
        isEdited: true,

        delta: dirtyFieldsArr.includes("delta") ? post.delta : undefined,
        desc: dirtyFieldsArr.includes("desc") ? post.desc : undefined,
        html: clean,

        tags: !tagsArr
          ? undefined
          : {
              set: tagsArr.map((tag: any) => ({ id: tag.id })),
            },
      },
      include: {
        tags: true,
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
