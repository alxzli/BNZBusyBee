import { NextRequest, NextResponse } from "next/server";
import { getWellbeingDashboardData } from "@/lib/wellbeing-service";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "alex";
  return NextResponse.json(getWellbeingDashboardData(userId));
}
