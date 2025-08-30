import dotenv from "dotenv";
import express from "express";
import { initiateApp } from "./initiateApp.js";
import { Application } from "express";
import { getJsonResponse } from "./utils/helperMethods/getJsonResponse.js";
dotenv.config();

const app: Application = express();

initiateApp(app);
