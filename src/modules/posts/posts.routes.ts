import { Router } from "express";
import { getPosts } from "./controllers/getPosts.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { addPostSchema } from "./validations/addPost.validation.js";
import { addPost } from "./controllers/addPost.js";
import { getSinglePost } from "./controllers/getSinglePost.js";
import { updatePost } from "./controllers/updatePost.js";
import { updatePostSchema } from "./validations/updatePost.validation.js";
import { deletePost } from "./controllers/deletePost.js";
import { incViews } from "./controllers/incViews.js";

const router: Router = Router();

router.get("/getPosts", getPosts);
router.get("/getPost/:slug", getSinglePost);
router.post("/incViews/:slug", incViews);

//========================================================================================
//================================ Auth routes ===========================================
//========================================================================================

router.post("/addPost", validationMiddleware(addPostSchema), addPost);
router.put(
  "/updatePost/:slug",
  validationMiddleware(updatePostSchema),
  updatePost
);
router.delete("/deletePost/:slug", deletePost);

export default router;
