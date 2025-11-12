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

//====================================================================
//================ what to test ====================================
//====================================================================

/*

| Dependency                       | Should You Mock?            | Why                                                        |
| -------------------------------- | --------------------------- | ---------------------------------------------------------- |
| **Prisma**                       | ✅ In unit/integration tests | Avoid hitting real DB; test faster and isolate logic       |
| **Redis**                        | ✅ In most tests             | Don’t rely on external service; can fake cache behavior    |
| **Clerk SDK / Webhook**          | ✅                           | External API — mock HTTP calls and payloads                |
| **Express app.listen()**         | ✅                           | Don’t actually start a server; test app instance only      |
| **Environment variables (.env)** | Sometimes                   | Use a `.env.test` or `vi.stubEnv()`                        |
| **3rd-party HTTP requests**      | ✅                           | Avoid hitting APIs; use `vi.mock("node-fetch")` or similar |
| **Logger / morgan**              | ✅ (optional)                | You can suppress console noise during tests                |

*/

//====================================================================
//================ libraries along side vitest ======================
//====================================================================

/*

| Purpose                      | Recommended Library                                 | Why                                                       |
| ---------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| **HTTP request simulation**  | `supertest`                                         | To send requests to Express app (no need to start server) |
| **Mocking Prisma**           | `vitest` built-in mocks OR `prisma-mock` (optional) | Quickly fake Prisma responses                             |
| **Mocking Redis**            | `ioredis-mock` or manual mock                       | Simulate Redis client behavior                            |
| **Environment setup**        | `dotenv` or built-in Node support                   | Load test env variables                                   |
| **Code coverage**            | `c8` (Vitest uses it by default)                    | Generate coverage reports                                 |
| **Data factories / seeding** | `@faker-js/faker`                                   | Generate fake user/post data for E2E tests                |

*/
