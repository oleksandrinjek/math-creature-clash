import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { makeProblem } from "../game-data";

export default defineTool({
  name: "generate_math_problem",
  title: "Generate a math problem",
  description: "Generate a battle math problem (with its answer) for the given operation and player level.",
  inputSchema: {
    operation: z.enum(["multiply", "add", "subtract"]).describe("Math operation used in battle."),
    level: z.number().int().min(1).max(50).describe("Player level; higher levels use bigger numbers."),
    count: z.number().int().min(1).max(20).optional().describe("How many problems to generate (default 1)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: ({ operation, level, count }) => {
    const problems = Array.from({ length: count ?? 1 }, () => makeProblem(operation, level));
    return {
      content: [{ type: "text", text: JSON.stringify(problems, null, 2) }],
      structuredContent: { problems },
    };
  },
});
