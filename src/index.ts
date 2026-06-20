import dotenv from "dotenv";
import express, { Application } from "express";
import { initiateApp } from "./initiateApp.js";
import { addCateogiresToDB } from "./modules/categories/utils/addCategoriesToDB.js";
import {
  addPostsToDB,
  addQuillPostsToDB,
} from "./modules/posts/utils/addPostsToDB.js";
dotenv.config();

const app: Application = express();

// addCommentsToDB(80);
// addPostsToDB(50);
// addFeaturedPostsToRedis();
// assignRandomImages();
// addCateogiresToDB();
// updateComments();
// addQuillPostsToDB(50);

try {
  initiateApp(app);
} catch (error) {
  console.log("Main server error : ", error);
}

// async function test() {
//   await prisma.$connect();
//   console.log("✅ Prisma connected to MySQL");

//   const users = await prisma.user.findMany({ take: 1 });
//   console.log("✅ Query works:", users);

//   await prisma.$disconnect();
// }

// test().catch((err) => {
//   console.error("❌ Prisma error:", err);
// });

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("uncaughtExceptionMonitor", (err) => {
  console.error("Uncaught Exception (Monitor):", err);
});

export default app;
