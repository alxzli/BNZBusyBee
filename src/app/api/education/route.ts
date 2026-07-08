import { NextResponse } from "next/server";
import { generateBedrockText } from "@/lib/bedrock";
import { learningModules, quickInsights } from "@/lib/mock-data";

export async function GET() {
  const aiGuide = await generateBedrockText({
    systemPrompt: "You map spending behavior to short educational nudges for a fintech demo.",
    userPrompt: `Suggest a short educational next step based on these insights: ${JSON.stringify(quickInsights)}`,
  });

  return NextResponse.json({
    source: aiGuide ? "bedrock" : "mock",
    aiGuide,
    modules: learningModules,
  });
}