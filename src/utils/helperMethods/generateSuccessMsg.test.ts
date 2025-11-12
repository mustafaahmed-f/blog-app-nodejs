import { describe, expect, it } from "vitest";
import { getSuccessMsg } from "./generateSuccessMsg.js";
import { ActionsType } from "../../types/ActionsType.js";
import { ModulesType } from "../../types/ModulesType.js";

describe("generateSuccessMsg()", () => {
  it("should return success message for single-word module", () => {
    const module: ModulesType = "Post";
    const verb: "has" | "have" = "has";
    const action: ActionsType = "created";
    const successMsg: string = `${module} ${verb} been ${action} successfully !!`;
    expect(getSuccessMsg(module, verb, action)).toEqual(successMsg);
  });

  it("should return success message for plural-word module", () => {
    const module: ModulesType = "Post";
    const verb: "has" | "have" = "have";
    const action: ActionsType = "created";
    const successMsg: string = `${module}s ${verb} been ${action} successfully !!`;
    expect(getSuccessMsg(module, verb, action)).toEqual(successMsg);
  });
});
