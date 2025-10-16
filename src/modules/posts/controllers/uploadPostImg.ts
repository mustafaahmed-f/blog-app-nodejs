import { NextFunction, Request, Response } from "express";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";

export async function uploadPostImg(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //todo : use RabbitMQ to remove image if post is not published.
    const image = req?.file?.buffer;
    const fakeImgURL =
      "https://storage.googleapis.com/fir-auth-1c3bc.appspot.com/1694290122808-71AL1tTRosL._SL1500_.jpg";

    return res.status(201).json(
      getJsonResponse({
        message: "Image uploaded successfully",
        data: fakeImgURL,
      })
    );
  } catch (error) {
    return next(error);
  }
}

/*

// After successful Cloudinary upload:
const uploadedImage = {
  secure_url,
  public_id,
  uploadedAt: Date.now(),
};

// Save temporarily to Redis (expires after 1 hour)
await redisClient.setex(
  `temp:uploads:${userId}:${postDraftId}`,
  3600, // 1 hour
  JSON.stringify(uploadedImage)
);


await redisClient.del(`temp:uploads:${userId}:${postDraftId}`);


const keys = await redisClient.keys("temp:uploads:*");
for (const key of keys) {
  const data = JSON.parse(await redisClient.get(key));
  if (Date.now() - data.uploadedAt > 3600000) { // older than 1 hour
    await cloudinary.uploader.destroy(data.public_id);
    await redisClient.del(key);
  }
}

*/
