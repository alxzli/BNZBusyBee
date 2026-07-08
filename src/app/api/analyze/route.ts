import { NextResponse } from "next/server";
import { generateBedrockText } from "@/lib/bedrock";
import { quickInsights, transactions } from "@/lib/mock-data";

export async function POST() {
  const fallback = quickInsights;

  const aiSummary = await generateBedrockText({
    systemPrompt: "You are a banking insights assistant creating concise and practical financial coaching summaries.",
    userPrompt: `Summarize the top 3 actionable insights from this transaction sample: ${JSON.stringify(transactions)}`,
  });

  return NextResponse.json({
    source: aiSummary ? "bedrock" : "mock",
    summary: aiSummary,
    insights: fallback,
  });
}