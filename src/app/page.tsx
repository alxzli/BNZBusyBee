"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GoalForecastChart } from "@/components/goal-forecast-chart";
import { PageBackButton } from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlanStorageKey } from "@/lib/user-storage";
import { ensureStoredUserId, getStoredUserId } from "@/lib/wellbeing-user";
import type { PlanResponse, WellbeingDashboardResponse } from "@/lib/wellbeing-types";

const WALKTHROUGH_REOPEN_EVENT = "bnzbusybee:walkthrough-reopen";

export default function DashboardPage() {
  const [data, setData] = useState<WellbeingDashboardResponse | null>(null);
  const [savedPlan, setSavedPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState(getStoredUserId());

  useEffect(() => {
    const syncUser = () => setActiveUserId(getStoredUserId());

    setActiveUserId(ensureStoredUserId());
    window.addEventListener("wellbeing-user-changed", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("wellbeing-user-changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const response = await fetch("/api/wellbeing/dashboard", {
        cache: "no-store",
        headers: { "x-user-id": activeUserId },
      });
      const payload = (await response.json()) as WellbeingDashboardResponse;

      const planRaw = localStorage.getItem(getPlanStorageKey(activeUserId));

      if (cancelled) {
        return;
      }

      setData(payload);
      setSavedPlan(planRaw ? (JSON.parse(planRaw) as PlanResponse) : null);
      setLoading(false);
    }

    load().catch(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeUserId]);

  const hasForecast = Boolean(savedPlan?.forecast?.length);

  const topThree = useMemo(() => (data?.suggestions ?? []).slice(0, 3), [data?.suggestions]);

  function reopenWalkthrough() {
    window.dispatchEvent(new Event(WALKTHROUGH_REOPEN_EVENT));
  }

  return (
    <div className="space-y-12 pb-6">
      <PageBackButton mode="static" onClick={reopenWalkthrough} />

      <section className="space-y-3 pt-0.5">
        <h1 className="text-5xl font-semibold tracking-tight text-[#0C2F59]">BNZ Financial Wellbeing</h1>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <Card className="min-h-[430px]">
          <CardHeader className="space-y-5">
            <CardTitle className="text-3xl">AI Suggestions</CardTitle>
            <CardDescription className="text-base">{data?.suggestionsHeadline ?? "Loading suggested savings opportunities..."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && <p className="text-[#0C2F59]/70">Loading...</p>}
            {!loading &&
              topThree.map((item) => (
                <div key={item.id} className="space-y-1">
                  <p className="text-2xl font-semibold text-[#0C2F59]">{item.title}</p>
                  <p className="text-base text-[#0C2F59]/80">Based on {item.reason.toLowerCase()}</p>
                </div>
              ))}

            <Link href="/suggestions" className="block pt-4 text-2xl text-[#0C2F59] underline-offset-4 hover:underline">
              View more suggestions...
            </Link>
          </CardContent>
        </Card>

        <Card className="min-h-[430px]">
          <CardHeader className="space-y-5">
            <CardTitle className="text-3xl">
              Forecast{savedPlan?.goalType ? ` for ${savedPlan.goalType}` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!hasForecast && (
              <div className="space-y-6 rounded-[0.625rem] border border-[#d5e3ef] bg-[#E5F2F8] p-6">
                <p className="text-2xl font-medium text-[#0C2F59]">{data?.hero.title}</p>
                <p className="text-base text-[#0C2F59]/80">{data?.hero.subtitle}</p>
                <Link href="/goals-setup">
                  <Button>{data?.hero.ctaLabel ?? "Start questionnaire"}</Button>
                </Link>
              </div>
            )}

            {hasForecast && savedPlan && (
              <div className="space-y-4">
                <GoalForecastChart data={savedPlan.forecast} />
                <p className="text-4xl font-semibold text-[#0C2F59]">${savedPlan.projectedBalanceAfterOneYear.toFixed(0)}</p>
                <p className="text-base text-[#0C2F59]/80">Projected balance in one year using BNZ savings account at {(savedPlan.annualRate * 100).toFixed(1)}% p.a.</p>
                <Link href="/goals-setup">
                  <Button variant="secondary">Adjust questionnaire</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
