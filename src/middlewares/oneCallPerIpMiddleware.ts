import { NextFunction, Request, Response } from "express";
import { redisClientInstance } from "../services/redisClient.js";

export function oneCallPerIpMiddleware(s: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Called");
      let ip = req.ip;
      let postSlug = req.params.slug?.toString();
      if (!postSlug) {
        return res.status(400).json({ error: "Post slug is required." });
      }
      console.log("ip : ", ip);
      const redis = redisClientInstance();
      let viewKey = await redis.setNX(
        `${process.env.VIEW_KEY_PREFIX}_${ip}_${postSlug}`,
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
