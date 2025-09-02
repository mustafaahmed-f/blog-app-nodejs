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
import { searchPost } from "./controllers/searchPost.js";
import { toggleLike } from "./controllers/toggleLike.js";
import { getPostsWithFilter } from "./controllers/getPostsWithFilter.js";
import { oneCallPerIpMiddleware } from "../../middlewares/oneCallPerIpMiddleware.js";

const router: Router = Router();

router.get("/getPosts", getPosts);
router.get("/getPost/:slug", getSinglePost);
router.get("/search", searchPost);
router.get("/getPostsWithFilter", getPostsWithFilter);
router.post("/incViews/:slug", oneCallPerIpMiddleware(""), incViews);

//========================================================================================
//================================ Auth routes ===========================================
//========================================================================================

router.post("/toggleLike", toggleLike);
router.post("/addPost", validationMiddleware(addPostSchema), addPost);
router.put(
  "/updatePost/:slug",
  validationMiddleware(updatePostSchema),
  updatePost
);
router.delete("/deletePost/:slug", deletePost);

export default router;
