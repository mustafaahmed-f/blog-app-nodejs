import { Router } from "express";
import { getPosts } from "./controllers/getPosts.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { addPostSchema } from "./validations/addPost.validation.js";
import { addPost } from "./controllers/addPost.js";

const router: Router = Router();

router.get("/getPosts", getPosts);
router.post("/addPost", validationMiddleware(addPostSchema), addPost);

export default router;
