import { prisma } from "../../../services/prismaClient.js";
import { redisClientInstance } from "../../../services/redisClient.js";
import { getKeysFromRedis } from "../../../utils/helperMethods/getKeysFromRedis.js";

export async function uploadPostImages(draftId: string) {
  const redisPattern = `${process.env.TEMP_IMG_UPLOADS_PREFIX}:${draftId}:*`;

  const redis = redisClientInstance();
  const keys = await getKeysFromRedis(redis as any, redisPattern);

  if (keys.length === 0) return;

  try {
    const imagesData = await Promise.allSettled(
      keys.map(async (key) => {
        try {
          const imgObj = await redis.get(key);
          if (!imgObj) throw new Error(`Missing Redis data for key: ${key}`);
          return JSON.parse(imgObj);
        } catch (err) {
          console.error("Error reading Redis key:", key, err);
          throw err;
        }
      })
    );

    const resolvedImages = imagesData
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter(Boolean);

    if (resolvedImages.length > 0) {
      await prisma.post_images.createMany({
        data: resolvedImages.map((img) => ({
          url: img.secure_url,
          public_id: img.public_id,
          postDraftId: draftId,
        })),
      });
    }

    await redis.del(keys);
  } catch (err) {
    console.error("uploadPostImages error:", err);
    throw err;
  }
}
