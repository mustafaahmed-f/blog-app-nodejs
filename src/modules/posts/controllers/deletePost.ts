import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../../../services/cloudinary.js";

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw new Error("UserId from clerk is not found!!");
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) throw new Error("User not found");

    const userEmail = user?.email ?? "";

    const postSlug: string = req.params.slug;

    if (!postSlug) return next(new Error("Post slug is required."));

    const post = await prisma.post.findUnique({
      where: {
        slug: postSlug,
        userEmail,
      },
    });

    if (!post) return next(new Error("Post not found."));

    //// Delete img and remove folder
    const folder = `${process.env.CLOUDINARY_FOLDER}/Posts/${post.draftId}`;
    await cloudinary.uploader.destroy(post.img_publicId as string);
    await cloudinary.api.delete_folder(folder);

    const deletedPost = await prisma.post.delete({
      where: {
        slug: postSlug,
        userEmail,
      },
      omit: {
        id: true,
      },
      include: {
        tags: {},
      },
    });

    await prisma.tag.deleteMany({
      where: {
        AND: [
          {
            posts: {
              none: {},
            },
          },
          {
            id: {
              in: deletedPost.tags.map((tag: any) => tag.id ?? []),
            },
          },
        ],
      },
    });

    return res.status(200).json(
      getJsonResponse({
        message: getSuccessMsg("Post", "has", "deleted"),
        data: deletedPost,
      })
    );
  } catch (error) {
    console.log("Error in delete post : ", error);
    return next(new Error(handlePrismaError(error).message));
  }
}
