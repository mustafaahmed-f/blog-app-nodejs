import { clerkMiddleware } from "@clerk/express";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { oneCallPerIpMiddleware } from "../../middlewares/oneCallPerIpMiddleware.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { uploadFile } from "../../services/multer.js";
import { fileTypeValidation } from "../../utils/constants/FileTypeValidation.js";
import { addPost } from "./controllers/addPost.js";
import { deletePost } from "./controllers/deletePost.js";
import { getFeaturedPosts } from "./controllers/getFeaturedPosts.js";
import { getPosts } from "./controllers/getPosts.js";
import { getPostsWithFilter } from "./controllers/getPostsWithFilter.js";
import { getSinglePost } from "./controllers/getSinglePost.js";
import { incViews } from "./controllers/incViews.js";
import { searchPost } from "./controllers/searchPost.js";
import { toggleLike } from "./controllers/toggleLike.js";
import { updatePost } from "./controllers/updatePost.js";
import { uploadPostImg } from "./controllers/uploadPostImg.js";
import { addPostSchema } from "./validations/addPost.validation.js";

const router: Router = Router();

router.get("/getPosts", getPosts);

router.get("/search", searchPost);
router.get("/getPostsWithFilter", getPostsWithFilter);
router.get("/getFeaturedPosts", getFeaturedPosts);
router.put("/incViews/:slug", oneCallPerIpMiddleware(""), incViews);

//========================================================================================
//================================ Auth routes ===========================================
//========================================================================================

router.use(clerkMiddleware());

//// This route need userEmail if it is logged in but doesn't required auth
router.get("/getPost/:slug", getSinglePost);

router.post(
  "/uploadPostImg",
  checkAuth(),
  uploadFile(fileTypeValidation.image).single("img"),
  uploadPostImg
);
router.put("/toggleLike", toggleLike);
router.post(
  "/addPost",
  checkAuth(),
  uploadFile(fileTypeValidation.image).single("img"),
  validationMiddleware(addPostSchema),
  addPost
);
router.put(
  "/updatePost/:slug",
  checkAuth(),
  uploadFile(fileTypeValidation.image).single("img"),
  validationMiddleware(addPostSchema),
  updatePost
);
router.delete("/deletePost/:slug", checkAuth(), deletePost);

export default router;
