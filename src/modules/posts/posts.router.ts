import { Router } from "express";
import { getPosts } from "./controllers/getPosts.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { addPostSchema } from "./validations/addPost.validation.js";
import { addPost } from "./controllers/addPost.js";
import { getSinglePost } from "./controllers/getSinglePost.js";
import { updatePost } from "./controllers/updatePost.js";
import { updatePostSchema } from "./validations/updatePost.validation.js";

const router: Router = Router();

router.get("/getPosts", getPosts);
router.get("/getPost/:slug", getSinglePost);

//========================================================================================
//================================ Auth routes ===========================================
//========================================================================================

router.post("/addPost", validationMiddleware(addPostSchema), addPost);
router.put(
  "/updatePost/:slug",
  validationMiddleware(updatePostSchema),
  updatePost
);

export default router;
