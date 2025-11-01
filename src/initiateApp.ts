import { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";
import * as routes from "./routes.js";
import express from "express";
import { MainAppName } from "./utils/constants/MainAppName.js";
import { connectRedis } from "./services/redisClient.js";
import { RateLimit } from "./middlewares/RateLimit.js";
import { clerkWebhookHandler } from "./utils/clerkWebhookHandler.js";
import { initRedisExpirationListener } from "./utils/helperMethods/RedisKeyExpirationListener.js";
import cookieParser from "cookie-parser";

export async function initiateApp(app: Application) {
  const baseURL = `/${MainAppName}`;
  const port = process.env.PORT || 5000;

  //// Clerk webhook endpoint
  app.post(
    `${baseURL}/webhooks/clerk`,
    express.raw({ type: "application/json" }),
    clerkWebhookHandler
  );

  app.use(express.json());

  app.use(cookieParser());

  app.use(morgan("dev"));
  app.set("trust proxy", true);

  const allowedOrigins = [
    "http://localhost:3000",
    "https://blog-next-app-by-mustafa.vercel.app/",
    "https://blog-next-app-by-mustafa.vercel.app",
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      allowedHeaders: ["Content-Type", "Authorization", "x-client-id"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow all methods you need
      credentials: true,
    })
  );

  // app.options("*", cors());

  await connectRedis();

  initRedisExpirationListener();

  app.use(RateLimit());

  app.use(`${baseURL}/posts`, routes.postsRouter);
  app.use(`${baseURL}/comments`, routes.commentsRouter);
  app.use(`${baseURL}/categories`, routes.categoriesRouter);

  app.get("/", (req: Request, res: Response) => {
    return res.send(`Hello ${MainAppName}!!`);
  });

  app.use("/{*any}", (req: Request, res: Response) => {
    res.status(404).json({ error: "In-valid routing .. " });
  });

  app.use(globalErrorHandler);
  app.listen(port, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  );
}
