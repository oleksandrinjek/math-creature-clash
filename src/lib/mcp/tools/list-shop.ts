import { defineTool } from "@lovable.dev/mcp-js";
import { SHOP_ITEMS, SKINS, UPGRADES } from "../game-data";

export default defineTool({
  name: "list_shop",
  title: "List shop, skins and upgrades",
  description: "List everything buyable with coins: permanent upgrades, consumable shop items, and creature skins.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const data = { upgrades: UPGRADES, shopItems: SHOP_ITEMS, skins: SKINS };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
