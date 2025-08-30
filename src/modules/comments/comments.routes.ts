import { Router } from "express";
import { addComment } from "./controllers/addComment.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { updateCommentSchema } from "./validations/updateComment.validation.js";
import { updateComment } from "./controllers/updateComment.js";

const router: Router = Router();

router.post("/addComment", addComment);
router.put(
  "/updateComment/:id",
  validationMiddleware(updateCommentSchema),
  updateComment
);

export default router;
