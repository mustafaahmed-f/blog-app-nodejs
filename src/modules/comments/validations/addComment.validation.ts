import z from "zod";
import {
  maxLengthMsg,
  requiredFieldMsg,
} from "../../../utils/helperMethods/validationErrorMessages.js";

export const addCommentSchema = z.object({
  desc: z
    .string()
    .min(1, requiredFieldMsg("description"))
    .max(10000, maxLengthMsg(10000)),
});
