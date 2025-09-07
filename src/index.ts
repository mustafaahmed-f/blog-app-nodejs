import dotenv from "dotenv";
import express, { Application } from "express";
import { initiateApp } from "./initiateApp.js";
import { addPostsToDB } from "./modules/posts/utils/addPostsToDB.js";
dotenv.config();

const app: Application = express();

// addCommentsToDB(20);
// addPostsToDB(30);

initiateApp(app);
