import { NextRequest, NextResponse } from "next/server";
import { buildPlanFromQuestionnaire } from "@/lib/wellbeing-service";
import type { PlanRequest } from "@/lib/wellbeing-types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PlanRequest;

  if (!body.goalType || body.targetAmount <= 0 || body.horizonYears <= 0 || body.currentSavings < 0 || body.weeklyContribution < 0) {
    return NextResponse.json({ error: "Invalid questionnaire payload" }, { status: 400 });
  }

  return NextResponse.json(buildPlanFromQuestionnaire(body));
}
