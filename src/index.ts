import dotenv from "dotenv";
import express, { Application } from "express";
import { initiateApp } from "./initiateApp.js";
import { assignRandomImages } from "./modules/posts/utils/assignImagesToPosts.js";
import { addCateogiresToDB } from "./modules/categories/utils/addCategoriesToDB.js";
import { addPostsToDB } from "./modules/posts/utils/addPostsToDB.js";
import { addCommentsToDB } from "./modules/comments/utils/addCommentsToDB.js";
import { addFeaturedPostsToRedis } from "./modules/posts/utils/addPostsToRedis.js";
import { updateComments } from "./modules/comments/utils/updateComments.js";
dotenv.config();

const app: Application = express();

// addCommentsToDB(80);
// addPostsToDB(50);
// addFeaturedPostsToRedis();
// assignRandomImages();
// addCateogiresToDB();
// updateComments();

try {
  initiateApp(app);
} catch (error) {
  console.log("Main server error : ", error);
}

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("uncaughtExceptionMonitor", (err) => {
  console.error("Uncaught Exception (Monitor):", err);
});
