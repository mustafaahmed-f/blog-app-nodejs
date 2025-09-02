import { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";
import * as routes from "./routes.js";
import express from "express";
import { MainAppName } from "./utils/constants/MainAppName.js";
import { connectRedis } from "./services/redisClient.js";

export async function initiateApp(app: Application) {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors());
  app.set("trust proxy", true);

  await connectRedis();

  const baseURL = `/${MainAppName}`;
  const port = process.env.PORT || 5000;

  app.get("/", (req: Request, res: Response) => {
    return res.send(`Hello ${MainAppName}!!`);
  });

  app.use(`${baseURL}/posts`, routes.postsRouter);
  app.use(`${baseURL}/comments`, routes.commentsRouter);
  app.use(`${baseURL}/categories`, routes.categoriesRouter);

  app.use("/{*any}", (req: Request, res: Response) => {
    res.json({ message: "In-valid routing .. " });
  });

  app.use(globalErrorHandler);
  app.listen(port, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  );
}
