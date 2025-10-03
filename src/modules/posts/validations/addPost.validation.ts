import { z } from "zod";
import {
  maxLengthMsg,
  minLengthMsg,
  requiredFieldMsg,
} from "../../../utils/helperMethods/validationErrorMessages.js";

export const addPostSchema = z.object({
  title: z
    .string()
    .min(1, requiredFieldMsg("title"))
    .min(5, minLengthMsg(5))
    .max(100, maxLengthMsg(100)),

  desc: z
    .string()
    .min(1, requiredFieldMsg("description"))
    .max(10000, maxLengthMsg(10000)),

  tags: z
    .string()
    .min(1, requiredFieldMsg("tags"))
    .max(100, maxLengthMsg(100))
    .regex(
      /^[a-zA-Z]+(?:,[a-zA-Z]+)*$/,
      "Tags must be letters separated by commas"
    ),

  html: z.string().min(1, requiredFieldMsg("html")),

  delta: z.string().min(1, requiredFieldMsg("delta")),

  categoryId: z.string().min(1, requiredFieldMsg("categoryId")),
});
