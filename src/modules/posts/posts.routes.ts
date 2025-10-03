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
import { getFeaturedPosts } from "./controllers/getFeaturedPosts.js";
import { uploadPostImg } from "./controllers/uploadPostImg.js";
import { uploadFile } from "../../services/multer.js";
import { fileTypeValidation } from "../../utils/constants/FileTypeValidation.js";

const router: Router = Router();

router.get("/getPosts", getPosts);
router.get("/getPost/:slug", getSinglePost);
router.get("/search", searchPost);
router.get("/getPostsWithFilter", getPostsWithFilter);
router.get("/getFeaturedPosts", getFeaturedPosts);
router.post("/incViews/:slug", oneCallPerIpMiddleware(""), incViews);

//========================================================================================
//================================ Auth routes ===========================================
//========================================================================================

router.post(
  "/uploadPostImg",
  uploadFile(fileTypeValidation.image).single("image"),
  uploadPostImg
);
router.post("/toggleLike", toggleLike);
router.post(
  "/addPost",
  uploadFile(fileTypeValidation.image).single("img"),
  validationMiddleware(addPostSchema),
  addPost
);
router.put(
  "/updatePost/:slug",
  uploadFile(fileTypeValidation.image).single("img"),
  validationMiddleware(updatePostSchema),
  updatePost
);
router.delete("/deletePost/:slug", deletePost);

export default router;
