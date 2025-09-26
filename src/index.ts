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

// addCommentsToDB(70);
// addPostsToDB(30);
// addFeaturedPostsToRedis();
// assignRandomImages();
// addCateogiresToDB();
// updateComments();

initiateApp(app);
