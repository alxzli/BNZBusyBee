import { NextRequest, NextResponse } from "next/server";
import { buildPlanFromQuestionnaire } from "@/lib/wellbeing-service";
import type { PlanRequest } from "@/lib/wellbeing-types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PlanRequest;
  const userId = request.headers.get("x-user-id") || "alex";
  const targetAmount = Number(body.targetAmount);
  const currentSavings = Number(body.currentSavings);
  const horizonYears = body.horizonYears == null ? null : Number(body.horizonYears);
  const weeklyContribution = body.weeklyContribution == null ? null : Number(body.weeklyContribution);

  if (!body.goalType || !Number.isFinite(targetAmount) || targetAmount <= 0 || !Number.isFinite(currentSavings) || currentSavings < 0) {
    return NextResponse.json({ error: "Invalid questionnaire payload" }, { status: 400 });
  }

  if ((horizonYears != null && (!Number.isFinite(horizonYears) || horizonYears <= 0)) || (weeklyContribution != null && (!Number.isFinite(weeklyContribution) || weeklyContribution < 0))) {
    return NextResponse.json({ error: "Invalid questionnaire payload" }, { status: 400 });
  }

  return NextResponse.json(await buildPlanFromQuestionnaire({ ...body, targetAmount, currentSavings, horizonYears, weeklyContribution }, userId));
}
