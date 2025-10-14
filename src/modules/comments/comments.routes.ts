import { clerkMiddleware } from "@clerk/express";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { addComment } from "./controllers/addComment.js";
import { deleteComment } from "./controllers/deleteComment.js";
import { getComments } from "./controllers/getComments.js";
import { updateComment } from "./controllers/updateComment.js";
import { addCommentSchema } from "./validations/addComment.validation.js";

const router: Router = Router();

router.get("/getComments", getComments);

//========================================================================================
//================================ Auth routes ===========================================
//========================================================================================

router.use(clerkMiddleware());

router.post(
  "/addComment",
  validationMiddleware(addCommentSchema),
  checkAuth(),
  addComment
);
router.put(
  "/updateComment/:id",
  checkAuth(),
  validationMiddleware(addCommentSchema),
  updateComment
);
router.delete("/deleteComment/:id", checkAuth(), deleteComment);

export default router;
