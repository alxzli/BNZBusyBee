import { NextResponse } from "next/server";
import { generateBedrockText } from "@/lib/bedrock";
import { recommendations, savingsGoals, transactions } from "@/lib/mock-data";

export async function GET() {
  const aiRecommendations = await generateBedrockText({
    systemPrompt: "You create concise financial wellness recommendations for a banking demo.",
    userPrompt: `Recommend 3 practical savings actions using these goals ${JSON.stringify(savingsGoals)} and transactions ${JSON.stringify(transactions)}.`,
  });

  return NextResponse.json({
    source: aiRecommendations ? "bedrock" : "mock",
    recommendations,
    aiRecommendations,
  });
}