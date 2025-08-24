import { ModulesType } from "../../types/ModulesType.js";
import { errMsgs } from "../constants/ErrorMsgs.js";

export function getErrorMsg(
  module: ModulesType,
  verb: "was" | "were",
  msgType: keyof typeof errMsgs
) {
  return `${module}${verb === "were" ? "s" : ""} ${verb} ${errMsgs[msgType]}`;
}
