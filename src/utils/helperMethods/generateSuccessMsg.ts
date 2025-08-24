import { ActionsType } from "../../types/ActionsType.js";
import { ModulesType } from "../../types/ModulesType.js";

export function getSuccessMsg(
  module: ModulesType,
  verb: "have" | "has",
  action: ActionsType
) {
  return `${module}${verb === "have" ? "s" : ""} ${verb} been ${action}`;
}
