import { defineTool } from "@lovable.dev/mcp-js";
import { CHARACTERS, ENEMIES } from "../game-data";

export default defineTool({
  name: "list_characters",
  title: "List characters",
  description: "List the playable creature, the buyable companion characters (with coin cost and battle bonus), and the enemy creatures.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify({ characters: CHARACTERS, enemies: ENEMIES }, null, 2) }],
    structuredContent: { characters: CHARACTERS, enemies: ENEMIES },
  }),
});
