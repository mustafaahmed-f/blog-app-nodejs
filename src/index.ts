import dotenv from "dotenv";
import express, { Application } from "express";
import { initiateApp } from "./initiateApp.js";
dotenv.config();

const app: Application = express();

// addCommentsToDB(20);
// addPostsToDB(30);
// addFeaturedPostsToRedis();

initiateApp(app);
