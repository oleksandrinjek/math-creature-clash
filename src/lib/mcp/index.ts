import { defineMcp } from "@lovable.dev/mcp-js";
import generateMathProblemTool from "./tools/generate-math-problem";
import getLevelScalingTool from "./tools/get-level-scaling";
import listCharactersTool from "./tools/list-characters";
import listShopTool from "./tools/list-shop";

export default defineMcp({
  name: "math-creature-combat",
  title: "Math Creature Combat",
  version: "0.1.0",
  instructions:
    "Tools for Math Creature Combat, a game where creatures battle by solving math problems. Use `list_characters` for the playable creature, companions and enemies, `list_shop` for upgrades, consumables and skins, `get_level_scaling` for enemy stats at a level, and `generate_math_problem` to create battle problems with answers.",
  tools: [listCharactersTool, listShopTool, getLevelScalingTool, generateMathProblemTool],
});
