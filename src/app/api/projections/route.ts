import { NextResponse } from "next/server";
import { projectionSeries } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    assumptions: {
      discretionaryReductionPct: 12,
      additionalMonthlySavings: 140,
    },
    projectionSeries,
  });
}