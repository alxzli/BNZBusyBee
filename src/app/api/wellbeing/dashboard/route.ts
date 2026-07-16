import { NextResponse } from "next/server";
import { getWellbeingDashboardData } from "@/lib/wellbeing-service";

export async function GET() {
  return NextResponse.json(getWellbeingDashboardData());
}
