import { NextRequest, NextResponse } from "next/server";
import { getWellbeingSuggestionsData } from "@/lib/wellbeing-service";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "alex";
  return NextResponse.json(await getWellbeingSuggestionsData(userId));
}
