"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageBackButton } from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SavingsSuggestion, WellbeingSuggestionsResponse } from "@/lib/wellbeing-types";

export default function SuggestionsPage() {
  const [data, setData] = useState<WellbeingSuggestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/wellbeing/suggestions", { cache: "no-store" });
      const payload = (await response.json()) as WellbeingSuggestionsResponse;
      setData(payload);
      setLoading(false);
    }

    load();
  }, []);

  const suggestions: SavingsSuggestion[] = data?.suggestions ?? [];

  return (
    <div className="space-y-12">
      <PageBackButton mode="toHome" />

      <section className="space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight text-[#0C2F59]">AI suggestion details</h1>
        <p className="max-w-3xl text-lg text-[#0C2F59]/80">
          Why each suggestion appeared, what pattern triggered it, and how much it could add to your BNZ savings account over a year.
        </p>
      </section>

      <section className="rounded-[0.75rem] border border-[#d5e3ef] bg-[#E5F2F8] p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.18em] text-[#0C2F59]/70">Annual potential</p>
        <p className="mt-3 text-5xl font-semibold text-[#0C2F59]">${data?.annualSavingsTotal.toFixed(0) ?? "0"}</p>
        <p className="mt-2 text-sm text-[#0C2F59]/70">Mock estimate based on recent transactions and recurring behavior.</p>
      </section>

      <section className="grid gap-6">
        {loading && <p className="text-[#0C2F59]/70">Loading suggestions...</p>}
        {!loading &&
          suggestions.map((item) => (
            <Card key={item.id}>
              <CardHeader className="space-y-4">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.reason}</CardDescription>
                </div>
                <p className="text-4xl font-semibold text-[#0C2F59]">${item.monthlySavings.toFixed(0)}/month</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  {item.evidence.map((detail) => (
                    <div key={detail.label} className="rounded-[0.625rem] border border-[#d5e3ef] bg-[#E5F2F8] p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#0C2F59]/70">{detail.label}</p>
                      <p className="mt-2 text-sm font-medium text-[#0C2F59]">{detail.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button>{item.actionLabel}</Button>
                  <Button variant="secondary">Use this in my goal</Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </section>

      <div className="pt-2">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#0C2F59] underline-offset-4 hover:underline">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
