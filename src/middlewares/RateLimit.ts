import { NextFunction, Request, Response } from "express";
import { redisClientInstance } from "../services/redisClient.js";

export function RateLimit() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.socket.remoteAddress;

    const redis = redisClientInstance();
    const currentTimeWithSeconds = Math.floor(new Date().getTime() / 1000);
    const rateLimitSortedSet = `${process.env.RATE_LIMIT_SORTED_SET}_${ip}`;
    const rateLimitKey = `${ip}:${currentTimeWithSeconds}`;

    const tx = redis.multi(); //// Creating transaction

    tx.zAdd(rateLimitSortedSet, [
      {
        score: currentTimeWithSeconds,
        value: rateLimitKey,
      },
    ]);

    //// removing any keys before the last minute so we only have keys for one minute:
    tx.zRemRangeByScore(rateLimitSortedSet, 0, currentTimeWithSeconds - 60);

    tx.zCount(
      rateLimitSortedSet,
      currentTimeWithSeconds - 60,
      currentTimeWithSeconds
    );
    try {
      //// Excute transaction
      const results = await tx.exec();

      if (!results) return next(new Error("Redis transaction failed"));

      //TODO : after using k6 tool to test load , edit the rate limit
      //// Limit 100 requests per minute:
      const count = Number(results?.[2]);
      if (count >= 100) {
        return next(new Error("Reached request limit !!"));
      }
      next();
    } catch (error) {
      tx.discard();
      next(error);
    }
  };
}
