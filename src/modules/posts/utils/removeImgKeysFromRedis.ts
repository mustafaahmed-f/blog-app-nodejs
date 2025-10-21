import { redisClientInstance } from "../../../services/redisClient.js";

export async function removeImgKeysFromRedis(
  publicIds: string[],
  draftId: string
) {
  let keys: string[] = [];
  publicIds.forEach((id) => {
    keys.push(`${process.env.TEMP_IMG_UPLOADS_PREFIX}:${draftId}:${id}`);
  });

  const redis = redisClientInstance();
  return redis.del(keys);
}
