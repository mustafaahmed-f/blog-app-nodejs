import { Router } from "express";
import { addComment } from "./controllers/addComment.js";

const router: Router = Router();

router.post("/addComment", addComment);

export default router;
