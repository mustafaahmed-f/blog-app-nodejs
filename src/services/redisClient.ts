import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient>;

export async function connectRedis() {
  redisClient = createClient({
    url: "redis://redis:6379",
  });

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
