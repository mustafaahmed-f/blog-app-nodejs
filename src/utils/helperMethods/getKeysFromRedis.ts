import { RedisClientType } from "redis";

export async function getKeysFromRedis(
  redis: RedisClientType,
  pattern: string
): Promise<string[]> {
  let cursor = "0";
  let keys: string[] = [];

  do {
    const { cursor: newCursor, keys: foundKeys } = await redis.scan(cursor, {
      COUNT: 100,
      MATCH: pattern,
      TYPE: "string",
    });

    cursor = newCursor;
    keys.push(...foundKeys);
  } while (cursor !== "0");

  return keys;
}
