import { Redis } from "ioredis";
import { v2 as cloudinary } from "cloudinary";
import { checkCloudinaryFolderEmpty } from "./checkCloudinaryFolderEmpty.js";

export async function initRedisExpirationListener() {
  //// Create a Redis client for events
  const subscriber = new Redis(process.env.REDIS_URL as string);

  //// Ensure Redis is configured to emit expiration events
  const configClient = new Redis(process.env.REDIS_URL as string);

  //// "SET" : We’re setting a Redis configuration value.
  //// "notify-keyspace-events" : The specific config option we’re modifying — it controls which events Redis will publish to the notification channels.
  //// "Ex": E => Enable Keyevent events — notifications about specific types of key events (like expired, set, deleted).
  //// "Ex": x => Enable expired events — publish a notification when a key’s TTL expires.
  await configClient.config("SET", "notify-keyspace-events", "Ex");

  //// This line makes our subscriber Redis connection listen to the “expired” event channel.
  await subscriber.subscribe("__keyevent@0__:expired");

  subscriber.on("message", async (_: any, key: any) => {
    if (key.startsWith(process.env.TEMP_IMG_UPLOADS_PREFIX)) {
      const parts = key.split(":"); // ["Prefix" , "post_draftId" , "publicId"]
      const post_draftId = parts[1];
      const publicId = parts[2];

      console.log(`🕒 Redis expired key -> ${key}`);

      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`🧹 Deleted expired image from Cloudinary: ${publicId}`);

        const checkResult = await checkCloudinaryFolderEmpty(post_draftId);
        if (checkResult) {
          console.log(
            `🗑️ Folder deleted: ${process.env.CLOUDINARY_FOLDER}/Posts/${post_draftId}`
          );
        } else {
          console.log(
            `🗑️ Folder not deleted: ${process.env.CLOUDINARY_FOLDER}/Posts/${post_draftId}`
          );
        }
      } catch (err) {
        console.error(`❌ Failed to delete Cloudinary image: ${publicId}`, err);
      }
    }
  });

  console.log("✅ Redis expiration listener initialized");
}
