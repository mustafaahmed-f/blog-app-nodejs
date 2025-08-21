import { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";
import * as routers from "./routers.js";
import express from "express";
import { MainAppName } from "./utils/constants/MainAppName.js";

export function initiateApp(app: Application) {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(globalErrorHandler);

  const baseURL = `/${MainAppName}`;
  const port = process.env.PORT || 5000;

  app.get("/", (req: Request, res: Response) => {
    return res.send(`Hello ${MainAppName}!!`);
  });

  app.get(`${baseURL}/posts`, routers.postsRouter);

  app.use("/{*any}", (req: Request, res: Response) => {
    res.json({ message: "In-valid routing .. " });
  });

  app.listen(port, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  );
}
