import { Router } from "express";
import { addComment } from "./controllers/addComment.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { updateCommentSchema } from "./validations/updateComment.validation.js";
import { updateComment } from "./controllers/updateComment.js";
import { deleteComment } from "./controllers/deleteComment.js";
import { getComments } from "./controllers/getComments.js";

const router: Router = Router();

router.get("/getComments", getComments);

//========================================================================================
//================================ Auth routes ===========================================
//========================================================================================

router.post("/addComment", addComment);
router.put(
  "/updateComment/:id",
  validationMiddleware(updateCommentSchema),
  updateComment
);
router.delete("/deleteComment/:id", deleteComment);

export default router;
