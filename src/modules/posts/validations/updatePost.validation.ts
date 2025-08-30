import z from "zod";
import {
  invalidUrlMsg,
  maxLengthMsg,
  requiredFieldMsg,
} from "../../../utils/helperMethods/validationErrorMessages.js";

export const updatePostSchema = z.object({
  title: z.string().max(100, maxLengthMsg(100)).optional(),

  desc: z.string().max(10000, maxLengthMsg(10000)).optional(),

  img: z.url(invalidUrlMsg()).optional().nullable(),

  categoryId: z.string().optional(),

  tags: z
    .string()
    .max(100, maxLengthMsg(100))
    .regex(
      /^[a-zA-Z]+(?:,[a-zA-Z]+)*$/,
      "Tags must be letters separated by commas"
    )
    .optional(),
});
