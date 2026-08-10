import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { enemyStatsForLevel } from "../game-data";

export default defineTool({
  name: "get_level_scaling",
  title: "Get level scaling",
  description: "Get the enemy name, enemy HP, enemy damage range and XP needed for the next level at a given player level.",
  inputSchema: {
    level: z.number().int().min(1).max(50).describe("Player level to inspect."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ level }) => {
    const stats = enemyStatsForLevel(level);
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
      structuredContent: stats,
    };
  },
});
