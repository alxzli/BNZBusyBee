"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GoalForecastChart } from "@/components/goal-forecast-chart";
import { PageBackButton } from "@/components/page-back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildFormStateFromPlan } from "@/lib/questionnaire-form";
import { getPlanStorageKey } from "@/lib/user-storage";
import { SKIP_WALKTHROUGH_ONCE_KEY } from "@/lib/walkthrough";
import { getStoredUserId } from "@/lib/wellbeing-user";
import type { PlanRequest, PlanResponse } from "@/lib/wellbeing-types";

type FormState = {
  goalType: string;
  targetAmount: string;
  horizonYears: string;
  currentSavings: string;
  weeklyContribution: string;
};

const steps = [
  { key: "goalType", title: "What is your main goal?", placeholder: "House deposit" },
  { key: "targetAmount", title: "How much do you want to reach?", placeholder: "50000" },
  { key: "horizonYears", title: "How many years do you want to save for?", placeholder: "3" },
  { key: "currentSavings", title: "How much do you already have saved?", placeholder: "2000" },
  { key: "weeklyContribution", title: "How much can you put aside weekly?", placeholder: "120" },
] as const;

const initialForm: FormState = {
  goalType: "",
  targetAmount: "",
  horizonYears: "",
  currentSavings: "",
  weeklyContribution: "",
};

export default function GoalsSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdjustingExistingPlan, setIsAdjustingExistingPlan] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("wellbeing-user") || "alex";
    const savedPlanRaw = localStorage.getItem(getPlanStorageKey(userId));
    if (!savedPlanRaw) {
      return;
    }

    try {
      const savedPlan = JSON.parse(savedPlanRaw) as PlanResponse;
      const answers = savedPlan?.questionnaireAnswers;
      setForm(buildFormStateFromPlan({
        goalType: answers?.goalType ?? savedPlan?.goalType ?? "",
        targetAmount: answers?.targetAmount ?? null,
        horizonYears: answers?.horizonYears ?? null,
        currentSavings: answers?.currentSavings ?? null,
        weeklyContribution: answers?.weeklyContribution ?? null,
      }));
      setIsAdjustingExistingPlan(Boolean(answers || savedPlan?.goalType));
    } catch {
      setForm(initialForm);
      setIsAdjustingExistingPlan(false);
    }
  }, []);

  const currentStep = steps[step];
  const currentValue = form[currentStep.key];

  const canContinue = useMemo(() => {
    if (currentStep.key === "goalType") {
      return currentValue.trim().length > 1;
    }

    if (currentStep.key === "horizonYears" || currentStep.key === "weeklyContribution") {
      return currentValue.trim().length === 0 || Number(currentValue) > 0;
    }

    return Number(currentValue) > 0;
  }, [currentStep.key, currentValue]);

  function setCurrentValue(value: string) {
    setForm((previous) => ({
      ...previous,
      [currentStep.key]: value,
    }));
  }

  function parseOptionalNumber(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const parsedValue = Number(trimmed);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
  }

  async function submitPlan() {
    const payload: PlanRequest = {
      goalType: form.goalType,
      targetAmount: Number(form.targetAmount),
      horizonYears: parseOptionalNumber(form.horizonYears),
      currentSavings: Number(form.currentSavings),
      weeklyContribution: parseOptionalNumber(form.weeklyContribution),
    };

    setLoading(true);
    const userId = getStoredUserId();
    const response = await fetch("/api/wellbeing/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify(payload),
    });
    const plan = (await response.json()) as PlanResponse;
    setResult(plan);
    localStorage.setItem(getPlanStorageKey(userId), JSON.stringify(plan));
    setLoading(false);
  }

  function returnToDashboardWithoutWalkthrough() {
    window.sessionStorage.setItem(SKIP_WALKTHROUGH_ONCE_KEY, "1");
    router.push("/");
  }

  if (result) {
    const aiStatusLabel = "Mock";

    return (
      <div className="space-y-10">
        <PageBackButton mode="static" onClick={returnToDashboardWithoutWalkthrough} />

        <section className="space-y-3">
          <Badge variant="outline" className="border-[#bcd6ea] bg-white text-[#0C2F59]">
            {aiStatusLabel}
          </Badge>
          <h1 className="text-5xl font-semibold tracking-tight text-[#0C2F59]">Your first-year savings path</h1>
          <p className="max-w-3xl text-lg text-[#0C2F59]/80">This setup combines your answers with detected savings opportunities from your recent spending.</p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">${result.projectedBalanceAfterOneYear.toFixed(0)} after one year</CardTitle>
            <CardDescription className="text-base">{result.shortSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <GoalForecastChart data={result.forecast} />
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-none border border-[#d5e3ef] bg-[#E5F2F8] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#0C2F59]/70">Weekly contribution</p>
                <p className="mt-2 text-2xl font-semibold text-[#0C2F59]">${result.resolvedWeeklyContribution.toFixed(0)}</p>
              </div>
              <div className="rounded-none border border-[#d5e3ef] bg-[#E5F2F8] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#0C2F59]/70">Estimated horizon</p>
                <p className="mt-2 text-2xl font-semibold text-[#0C2F59]">{result.resolvedHorizonYears.toFixed(1)} years</p>
              </div>
              <div className="rounded-none border border-[#d5e3ef] bg-[#E5F2F8] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#0C2F59]/70">Annual from suggestions</p>
                <p className="mt-2 text-2xl font-semibold text-[#0C2F59]">${result.annualSavingsFromSuggestions.toFixed(0)}</p>
              </div>
              <div className="rounded-none border border-[#d5e3ef] bg-[#E5F2F8] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#0C2F59]/70">BNZ savings rate</p>
                <p className="mt-2 text-2xl font-semibold text-[#0C2F59]">{(result.annualRate * 100).toFixed(1)}% p.a.</p>
              </div>
            </div>
            <p className="text-sm text-[#0C2F59]/80">{result.nextStep}</p>
            <Button onClick={returnToDashboardWithoutWalkthrough}>Return to dashboard forecast</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PageBackButton mode="toHome" />

      <section className="space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight text-[#0C2F59]">5-minute goal questionnaire</h1>
        <p className="max-w-3xl text-lg text-[#0C2F59]/80">
          {isAdjustingExistingPlan
            ? "Update your current answers and we’ll rebuild your savings forecast."
            : "Answer five simple questions and we will prepare a BNZ savings account yearly projection."}
        </p>
      </section>

      <Card className="max-w-3xl">
        <CardHeader className="space-y-5">
          <p className="text-sm uppercase tracking-[0.18em] text-[#0C2F59]/70">
            Question {step + 1} of {steps.length}
          </p>
          {isAdjustingExistingPlan && (
            <p className="text-sm text-[#0C2F59]/70">You’re updating your current answers below.</p>
          )}
          <CardTitle className="text-3xl">{currentStep.title}</CardTitle>
          <input
            value={currentValue}
            onChange={(event) => setCurrentValue(event.target.value)}
            placeholder={currentStep.placeholder}
            inputMode={currentStep.key === "goalType" ? "text" : "numeric"}
            className="w-full rounded-none border border-[#d5e3ef] bg-[#E5F2F8] px-5 py-5 text-2xl font-semibold text-[#0C2F59] outline-none transition focus:border-[#7fb8da] focus:bg-white"
          />
          {currentStep.key === "horizonYears" && (
            <p className="text-sm text-[#0C2F59]/70">Leave this blank and we’ll estimate how many years it would take to reach the goal.</p>
          )}
          {currentStep.key === "weeklyContribution" && (
            <p className="text-sm text-[#0C2F59]/70">Leave this blank and we’ll calculate how much you need to put aside each week.</p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={() => setStep((current) => Math.max(0, current - 1))}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>
              Next question
            </Button>
          ) : (
            <Button disabled={!canContinue || loading} onClick={submitPlan}>
              {loading ? "Building your plan..." : "Build my savings plan"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
