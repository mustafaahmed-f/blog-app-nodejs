import { z } from "zod";
import {
  invalidUrlMsg,
  maxLengthMsg,
  requiredFieldMsg,
} from "../../../utils/helperMethods/validationErrorMessages.js";

export const addPostSchema = z.object({
  title: z
    .string()
    .min(1, requiredFieldMsg("title"))
    .max(100, maxLengthMsg(100)),

  desc: z
    .string()
    .min(1, requiredFieldMsg("description"))
    .max(10000, maxLengthMsg(10000)),

  img: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), {
          message: "Only image files are allowed",
        })
        .refine((file) => file.size <= 1024 * 1024, {
          message: "Image must be smaller than 1MB",
        }),
      z.string().url(invalidUrlMsg()),
    ])
    .refine((val) => val !== null, { message: "Image is required" }),

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
