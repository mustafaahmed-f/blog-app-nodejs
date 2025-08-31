import { Router } from "express";
import { getCategories } from "./controllers/getCategories.js";

const router: Router = Router();

router.get("/getCategories", getCategories);

export default router;
