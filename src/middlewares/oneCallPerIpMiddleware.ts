import { NextFunction, Request, Response } from "express";
import { redisClientInstance } from "../services/redisClient.js";

export function oneCallPerIpMiddleware(s: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let ip =
        req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        req.socket.remoteAddress;

      let identifier =
        req.headers["x-client-id"] || req.cookies.client_id || ip;

      let postSlug = req.params.slug?.toString();
      let postId = req.query.postId?.toString();
      if (!postSlug) {
        return res.status(400).json({ error: "Post slug is required." });
      }

      const redis = redisClientInstance();
      let viewKey = await redis.set(
        `${process.env.VIEW_KEY_PREFIX}_${identifier}_${postId || postSlug}`,
        "true",
        {
          condition: "NX",
          expiration: {
            type: "EX",
            value: 60 * 60 * 24 * 15, //* 15 days
          },
        }
      );
      if (!viewKey) {
        return res.status(429).json({ error: "You already viewed this post" });
      }
      return next();
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Server error" });
    }
  };
}
