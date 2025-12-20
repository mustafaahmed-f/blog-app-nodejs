import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import * as routes from "../routes.js";
import { globalErrorHandler } from "../utils/globalErrorHandler.js";

export function createApp() {
  const app = express();
  const baseURL = `/blogapp`;

  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.set("trust proxy", true);
  app.use(cors({ credentials: true }));

  // app.use(RateLimit());

  app.use(`${baseURL}/posts`, routes.postsRouter);
  app.use(`${baseURL}/comments`, routes.commentsRouter);
  app.use(`${baseURL}/categories`, routes.categoriesRouter);

  app.use("/{*any}", (req: Request, res: Response) => {
    res.status(404).json({ error: "In-valid routing .. " });
  });

  app.use(globalErrorHandler);

  return app;
}
