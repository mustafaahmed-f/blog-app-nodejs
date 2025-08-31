import { ActionsType } from "../../types/ActionsType.js";
import { ModulesType } from "../../types/ModulesType.js";

const exceptionalPluralModules = {
  Category: "Categories",
};

const getPlural = (module: ModulesType) =>
  Object.keys(exceptionalPluralModules).includes(module)
    ? exceptionalPluralModules[module as keyof typeof exceptionalPluralModules]
    : `${module}s`;

export function getSuccessMsg(
  module: ModulesType,
  verb: "have" | "has",
  action: ActionsType
) {
  return `${
    verb === "have" ? getPlural(module) : `${module}`
  } ${verb} been ${action} successfully !!`;
}
