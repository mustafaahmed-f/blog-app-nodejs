import { Router } from "express";
import { addComment } from "./controllers/addComment.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { updateCommentSchema } from "./validations/updateComment.validation.js";
import { updateComment } from "./controllers/updateComment.js";
import { deleteComment } from "./controllers/deleteComment.js";
import { getComments } from "./controllers/getComments.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { clerkMiddleware } from "@clerk/express";
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
  validationMiddleware(updateCommentSchema),
  updateComment
);
router.delete("/deleteComment/:id", checkAuth(), deleteComment);

export default router;
