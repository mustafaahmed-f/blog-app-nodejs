import dotenv from "dotenv";
import express from "express";
import { initiateApp } from "./initiateApp.js";
import { Application } from "express";
import { getJsonResponse } from "./utils/helperMethods/getJsonResponse.js";
import { addCommentsToDB } from "./modules/comments/utils/addCommentsToDB.js";
dotenv.config();

const app: Application = express();

// addCommentsToDB(20);

initiateApp(app);
