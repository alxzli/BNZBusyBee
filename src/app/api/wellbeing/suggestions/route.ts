import { NextResponse } from "next/server";
import { getWellbeingSuggestionsData } from "@/lib/wellbeing-service";

export async function GET() {
  return NextResponse.json(getWellbeingSuggestionsData());
}
