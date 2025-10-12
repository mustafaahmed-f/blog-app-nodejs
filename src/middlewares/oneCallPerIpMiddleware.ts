import { NextFunction, Request, Response } from "express";
import { redisClientInstance } from "../services/redisClient.js";

export function oneCallPerIpMiddleware(s: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let ip = req.ip;
      console.log("IP:", ip);
      let postSlug = req.params.slug?.toString();
      let postId = req.query.postId?.toString();
      if (!postSlug) {
        return res.status(400).json({ error: "Post slug is required." });
      }

      const redis = redisClientInstance();
      let viewKey = await redis.setNX(
        `${process.env.VIEW_KEY_PREFIX}_${ip}_${postId || postSlug}`,
        "true"
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
