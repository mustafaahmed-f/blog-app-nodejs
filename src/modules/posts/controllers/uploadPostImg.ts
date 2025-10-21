import { NextFunction, Request, Response } from "express";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";
import { uploadToCloudinary } from "../../../utils/helperMethods/uploadToCloudinary.js";
import { redisClientInstance } from "../../../services/redisClient.js";
import cloudinary from "../../../services/cloudinary.js";

export async function uploadPostImg(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let redis = redisClientInstance();

    //todo : use RabbitMQ to remove image if post is not published.
    if (!req.file) {
      return next(new Error("Image is required"));
    }

    const draftId = req.query.draftId?.toString();

    if (!draftId) return next(new Error("DraftId is required."));

    const folder = `${process.env.CLOUDINARY_FOLDER}/Posts/${draftId}`;

    const { resources: postImages } = await cloudinary.api.resources({
      type: "upload",
      prefix: folder + "/",
      max_results: 11,
    });

    if (postImages.length >= 10)
      return next(new Error("You can only upload 10 images."));

    const uploadResponse = await uploadToCloudinary(req.file?.buffer, folder);

    let secure_url = uploadResponse.secure_url;
    let public_id = uploadResponse.public_id;

    const redisKey = `${process.env.TEMP_IMG_UPLOADS_PREFIX}:${draftId}:${public_id}`;

    await redis.setEx(
      redisKey,
      60 * 60 * 2,
      // 60,
      JSON.stringify({ secure_url, public_id })
    );

    return res.status(201).json(
      getJsonResponse({
        message: "Image uploaded successfully",
        data: { secure_url, public_id },
      })
    );
  } catch (error) {
    return next(error);
  }
}
