import { NextResponse } from "next/server";
import { categoryBreakdown, monthlySpending, transactions } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    transactions,
    monthlySpending,
    categoryBreakdown,
  });
}