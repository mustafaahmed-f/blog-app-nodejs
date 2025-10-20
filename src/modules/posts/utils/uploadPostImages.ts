import { prisma } from "../../../services/prismaClient.js";
import { redisClientInstance } from "../../../services/redisClient.js";
import { getKeysFromRedis } from "../../../utils/helperMethods/getKeysFromRedis.js";

export async function uploadPostImages(draftId: string) {
  const redisPattern = `${process.env.TEMP_IMG_UPLOADS_PREFIX}:${draftId}:*`;

  const redis = redisClientInstance();
  const keys = await getKeysFromRedis(redis as any, redisPattern);
  if (keys.length > 0) {
    //// loop over keys in redis to check if post has content images and add them to post_images table
    const imagesData = await Promise.all(
      keys.map(async (key) => {
        const imgObj = await redis.get(key);
        const data = JSON.parse(imgObj!);
        return data;
      })
    );

    await prisma.post_images.createMany({
      data: imagesData.map((img) => {
        return {
          url: img.secure_url,
          public_id: img.public_id,
          postDraftId: draftId,
        };
      }),
    });

    await redis.del(keys);
  }
}
