import dotenv from "dotenv";
import express, { Application } from "express";
import { initiateApp } from "./initiateApp.js";
import { assignRandomImages } from "./modules/posts/utils/assignImagesToPosts.js";
dotenv.config();

const app: Application = express();

// addCommentsToDB(20);
// addPostsToDB(30);
// addFeaturedPostsToRedis();
// assignRandomImages();

initiateApp(app);
