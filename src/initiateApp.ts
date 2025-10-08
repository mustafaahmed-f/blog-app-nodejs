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
  app.use(morgan("dev"));
  app.set("trust proxy", true);

  app.use(
    cors({
      origin: "http://localhost:3000",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  await connectRedis();

  app.use(RateLimit());

  app.get("/", (req: Request, res: Response) => {
    return res.send(`Hello ${MainAppName}!!`);
  });

  app.use(`${baseURL}/posts`, routes.postsRouter);
  app.use(`${baseURL}/comments`, routes.commentsRouter);
  app.use(`${baseURL}/categories`, routes.categoriesRouter);

  app.use("/{*any}", (req: Request, res: Response) => {
    res.status(404).json({ error: "In-valid routing .. " });
  });

  app.use(globalErrorHandler);
  app.listen(port, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  );
}
