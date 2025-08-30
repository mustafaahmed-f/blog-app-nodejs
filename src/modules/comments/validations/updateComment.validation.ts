import z from "zod";
import { maxLengthMsg } from "../../../utils/helperMethods/validationErrorMessages.js";

export const updateCommentSchema = z.object({
  desc: z.string().max(10000, maxLengthMsg(10000)).optional(),
});
