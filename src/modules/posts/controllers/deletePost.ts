import { NextFunction, Request, Response } from "express";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { prisma } from "../../../services/prismaClient.js";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { getSuccessMsg } from "../../../utils/helperMethods/generateSuccessMsg.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../../../services/cloudinary.js";
import { checkIdAndUser } from "../../../utils/helperMethods/checkIdAndUser.js";

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await checkIdAndUser(req);

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

    //// Remove all post's images
    const folder = `${process.env.CLOUDINARY_FOLDER}/Posts/${post.draftId}`;

    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: folder + "/", // ensure trailing slash
      max_results: 1, // just need to check existence
    });

    if (resources.length > 0) {
      await cloudinary.api.delete_resources_by_prefix(folder);
      console.log(`Deleted images in ${folder}`);

      await cloudinary.api.delete_folder(folder);
      console.log(`Folder ${folder} deleted successfully`);
    }

    //todo: check if post exists in featured posts sorted set in redis and so we update set.

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
