import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient>;

export async function connectRedis() {
  const redisURL =
    process.env.NODE_ENV === "dev"
      ? process.env.REDIS_URL
      : process.env.REDIS_UPSTASH_URL;
  redisClient = createClient({
    url: redisURL,
  });

  console.log("Redis url : ", redisURL);

  redisClient.on("connect", () => console.log("Connected to Redis!"));
  redisClient.on("error", (err) => console.error("Redis Client Error", err));

  await redisClient.connect();
}

export function redisClientInstance() {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call connectRedis() first.");
  }

  return redisClient;
}
