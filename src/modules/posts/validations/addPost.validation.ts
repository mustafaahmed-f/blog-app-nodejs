import { z } from "zod";
import {
  invalidEmailMsg,
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

  img: z.url(invalidUrlMsg()).optional().nullable(),

  categoryId: z.string().min(1, requiredFieldMsg("categoryId")),
});
