import { Router } from "express";
import { getCategories } from "./controllers/getCategories.js";
import { getSingleCategory } from "./controllers/getSingleCategory.js";

const router: Router = Router();

router.get("/singleCategory/:category", getSingleCategory);
router.get("/getCategories", getCategories);

export default router;
