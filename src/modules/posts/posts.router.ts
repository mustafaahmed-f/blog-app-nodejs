import { Router } from "express";
import { getPosts } from "./controllers/getPosts.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { addPostSchema } from "./validations/addPost.validation.js";
import { addPost } from "./controllers/addPost.js";
import { getSinglePost } from "./controllers/getSinglePost.js";

const router: Router = Router();

router.get("/getPosts", getPosts);
router.get("/getPost/:slug", getSinglePost);
router.post("/addPost", validationMiddleware(addPostSchema), addPost);

export default router;
