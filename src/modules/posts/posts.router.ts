import { Router } from "express";
import { getPosts } from "./controllers/getPosts.js";

const router: Router = Router();

router.get("/getPosts", getPosts);

export default router;
