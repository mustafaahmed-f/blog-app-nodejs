import dotenv from "dotenv";
import { Application } from "express";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../../tests/createAppInstance.js";

dotenv.config({ path: ".env.test" });

const mainURL = "/blogapp";

describe("Posts Routes", () => {
  afterEach(async () => {
    // Clean MySQL
    // await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0`);
    // await prisma.$executeRawUnsafe(`TRUNCATE TABLE posts`);
    // await prisma.$executeRawUnsafe(`TRUNCATE TABLE comments`);
    // await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1`);
    // Clean Redis
    //   await redis.flushdb();
  });

  it.skip("Should return error if posts doesn't exist in DB", async () => {
    const app: Application = createApp();
    const res = await request(app).get(`${mainURL}/posts/getPosts`);

    expect(res.body).toEqual({ error: "Posts were not found" });
  });
});
