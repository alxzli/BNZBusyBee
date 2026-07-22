import { loadUserProfileFinancialData } from "@/lib/user-profiles";
import type {
  ForecastPoint,
  PlanRequest,
  PlanResponse,
  SavingsSuggestion,
  WellbeingDashboardResponse,
  WellbeingSuggestionsResponse,
} from "@/lib/wellbeing-types";

const BNZ_SAVINGS_ANNUAL_RATE = 0.045;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function getMonthlyRate(annualRate: number) {
  return annualRate / 12;
}

function annualizeFromWeekly(weekly: number) {
  return weekly * 52;
}

function detectSuggestionSet(userId = "alex"): SavingsSuggestion[] {
  const { transactions } = loadUserProfileFinancialData(userId);
  const subscriptions = transactions.filter((item) => item.merchant === "Netflix" || item.category === "Subscriptions");
  const dining = transactions.filter((item) => item.category === "Dining");
  const feeLike = transactions.filter((item) => item.merchant === "Trade Me");

  const subscriptionMonthly = subscriptions.reduce((sum, item) => sum + item.amount, 0);
  const diningMonthly = Math.max(0, dining.reduce((sum, item) => sum + item.amount, 0) * 0.35);
  const feeMonthly = Math.max(0, feeLike.reduce((sum, item) => sum + item.amount, 0) * 0.1);
  const idleCashMonthly = 18;

  const suggestions: SavingsSuggestion[] = [
    {
      id: "sub_trim",
      title: "Trim duplicate subscriptions",
      reason: "Recurring digital charges are showing up each month with similar values.",
      type: "subscription",
      weeklySavings: toCurrency(subscriptionMonthly / 4.345),
      monthlySavings: toCurrency(subscriptionMonthly),
      annualSavings: toCurrency(subscriptionMonthly * 12),
      confidence: "high",
      evidence: [
        { label: "Merchant", value: "Netflix" },
        { label: "Pattern", value: "Recurring monthly" },
        { label: "Recent charge", value: "$24.99" },
      ],
      actionLabel: "Review subscriptions",
    },
    {
      id: "dining_shift",
      title: "Shift one takeaway day to home meals",
      reason: "Dining spikes happen on commute days and can be redirected into savings.",
      type: "dining",
      weeklySavings: toCurrency(diningMonthly / 4.345),
      monthlySavings: toCurrency(diningMonthly),
      annualSavings: toCurrency(diningMonthly * 12),
      confidence: "medium",
      evidence: [
        { label: "Category", value: "Dining" },
        { label: "Adjustable share", value: "35%" },
        { label: "Estimated monthly shift", value: `$${toCurrency(diningMonthly)}` },
      ],
      actionLabel: "Set weekly food cap",
    },
    {
      id: "idle_cash_move",
      title: "Move idle cash into BNZ savings",
      reason: "Part of your balance can earn annual interest without locking funds long term.",
      type: "idle_cash",
      weeklySavings: toCurrency(idleCashMonthly / 4.345),
      monthlySavings: toCurrency(idleCashMonthly),
      annualSavings: toCurrency(idleCashMonthly * 12),
      confidence: "medium",
      evidence: [
        { label: "Idle balance", value: "$1,000+" },
        { label: "Current yield", value: "0%" },
        { label: "BNZ savings rate", value: `${(BNZ_SAVINGS_ANNUAL_RATE * 100).toFixed(1)}% p.a.` },
      ],
      actionLabel: "Move idle cash",
    },
    {
      id: "fee_cleanup",
      title: "Reduce avoidable account fees",
      reason: "Some charges look avoidable with a product tier check.",
      type: "fee",
      weeklySavings: toCurrency(feeMonthly / 4.345),
      monthlySavings: toCurrency(feeMonthly),
      annualSavings: toCurrency(feeMonthly * 12),
      confidence: "medium",
      evidence: [
        { label: "Recent fee-like spend", value: `$${toCurrency(feeLike.reduce((sum, item) => sum + item.amount, 0))}` },
        { label: "Potential reduction", value: "10%" },
        { label: "Check", value: "Product eligibility" },
      ],
      actionLabel: "Check fee options",
    },
  ];

  return suggestions.sort((a, b) => b.annualSavings - a.annualSavings);
}

function getDefaultGoalName(userId = "alex") {
  const { savingsGoals } = loadUserProfileFinancialData(userId);
  return savingsGoals[0]?.name || "a savings goal";
}

function buildForecast(startingBalance: number, weeklyContribution: number, annualSuggestionSavings: number, annualRate = BNZ_SAVINGS_ANNUAL_RATE): ForecastPoint[] {
  const monthlyRate = getMonthlyRate(annualRate);
  const monthlyContribution = (weeklyContribution * 52 + annualSuggestionSavings) / 12;

  const points: ForecastPoint[] = [];
  let balance = startingBalance;
  let contributionTotal = 0;
  const startDate = new Date();

  for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
    contributionTotal += monthlyContribution;
    balance += monthlyContribution;

    const interest = balance * monthlyRate;
    balance += interest;

    const pointDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthIndex, startDate.getDate());

    points.push({
      date: `${pointDate.getFullYear()}-${String(pointDate.getMonth() + 1).padStart(2, "0")}-${String(pointDate.getDate()).padStart(2, "0")}`,
      month: monthNames[monthIndex],
      projectedBalance: toCurrency(balance),
      contributed: toCurrency(contributionTotal),
      interestEarned: toCurrency(balance - startingBalance - contributionTotal),
    });
  }

  return points;
}

function estimateMonthsToTarget(startingBalance: number, targetAmount: number, monthlyContribution: number, annualRate = BNZ_SAVINGS_ANNUAL_RATE) {
  if (targetAmount <= startingBalance) {
    return 0;
  }

  if (monthlyContribution <= 0) {
    return 600;
  }

  const monthlyRate = getMonthlyRate(annualRate);
  let balance = startingBalance;
  let months = 0;

  while (balance < targetAmount && months < 600) {
    balance += monthlyContribution;
    const interest = balance * monthlyRate;
    balance += interest;
    months += 1;
  }

  return months;
}

function estimateWeeklyContributionNeeded(startingBalance: number, targetAmount: number, horizonYears: number, annualSuggestionSavings: number, annualRate = BNZ_SAVINGS_ANNUAL_RATE) {
  if (targetAmount <= startingBalance) {
    return 0;
  }

  const monthsToTarget = Math.max(1, Math.round(horizonYears * 12));
  const monthlyRate = getMonthlyRate(annualRate);

  const canReachTarget = (weeklyContribution: number) => {
    let balance = startingBalance;
    const monthlyContribution = (weeklyContribution * 52 + annualSuggestionSavings) / 12;

    for (let monthIndex = 0; monthIndex < monthsToTarget; monthIndex += 1) {
      balance += monthlyContribution;
      const interest = balance * monthlyRate;
      balance += interest;
    }

    return balance >= targetAmount;
  };

  let low = 0;
  let high = Math.max(50, targetAmount / 4);

  while (!canReachTarget(high)) {
    high *= 2;

    if (high > 1_000_000) {
      return 0;
    }
  }

  for (let index = 0; index < 60; index += 1) {
    const midpoint = (low + high) / 2;

    if (canReachTarget(midpoint)) {
      high = midpoint;
    } else {
      low = midpoint;
    }
  }

  return toCurrency(high);
}

export function resolveGoalInputs(payload: PlanRequest, annualSuggestionSavings: number, annualRate = BNZ_SAVINGS_ANNUAL_RATE) {
  const hasProvidedHorizon = typeof payload.horizonYears === "number" && payload.horizonYears > 0;
  const hasProvidedWeeklyContribution = typeof payload.weeklyContribution === "number" && payload.weeklyContribution > 0;

  let resolvedHorizonYears = hasProvidedHorizon ? payload.horizonYears ?? 0 : 0;
  let resolvedWeeklyContribution = hasProvidedWeeklyContribution ? payload.weeklyContribution ?? 0 : 0;

  if (!hasProvidedHorizon) {
    if (hasProvidedWeeklyContribution) {
      const monthlyContribution = ((payload.weeklyContribution ?? 0) * 52 + annualSuggestionSavings) / 12;
      const monthsNeeded = estimateMonthsToTarget(payload.currentSavings, payload.targetAmount, monthlyContribution, annualRate);
      resolvedHorizonYears = monthsNeeded === 0 ? 0 : monthsNeeded / 12;
    } else {
      resolvedHorizonYears = 5;
    }
  }

  if (!hasProvidedWeeklyContribution) {
    resolvedWeeklyContribution = estimateWeeklyContributionNeeded(
      payload.currentSavings,
      payload.targetAmount,
      resolvedHorizonYears || 5,
      annualSuggestionSavings,
      annualRate,
    );
  }

  return {
    resolvedHorizonYears: toCurrency(resolvedHorizonYears),
    resolvedWeeklyContribution: toCurrency(resolvedWeeklyContribution),
  };
}

export function getWellbeingDashboardData(userId = "alex"): WellbeingDashboardResponse {
  const suggestions = detectSuggestionSet(userId).slice(0, 3);
  const monthlyTotal = toCurrency(suggestions.reduce((sum, item) => sum + item.monthlySavings, 0));

  return {
    generatedAt: new Date().toISOString(),
    aiStatus: "mock",
    title: "BNZ Financial Wellbeing",
    suggestionsHeadline: `We found about $${monthlyTotal}/month you could put to work`,
    suggestions,
    goalMode: "hero",
    hero: {
      title: "Set your goals and unlock your forecast",
      subtitle: "A quick five-minute questionnaire will build a savings path based on your current patterns.",
      ctaLabel: "Start 5-minute questionnaire",
    },
  };
}

export function getWellbeingSuggestionsData(userId = "alex"): WellbeingSuggestionsResponse {
  const suggestions = detectSuggestionSet(userId);

  return {
    generatedAt: new Date().toISOString(),
    aiStatus: "mock",
    annualSavingsTotal: toCurrency(suggestions.reduce((sum, item) => sum + item.annualSavings, 0)),
    suggestions,
  };
}

export function buildPlanFromQuestionnaire(payload: PlanRequest, userId = "alex"): PlanResponse {
  const suggestions = detectSuggestionSet(userId);
  const annualSavingsFromSuggestions = toCurrency(suggestions.reduce((sum, item) => sum + item.annualSavings, 0));
  const { resolvedHorizonYears, resolvedWeeklyContribution } = resolveGoalInputs(payload, annualSavingsFromSuggestions);
  const totalContributionsYear = toCurrency(annualizeFromWeekly(resolvedWeeklyContribution));
  const forecast = buildForecast(payload.currentSavings, resolvedWeeklyContribution, annualSavingsFromSuggestions);
  const projectedBalanceAfterOneYear = forecast[forecast.length - 1]?.projectedBalance ?? payload.currentSavings;

  const goalLabel = payload.goalType || getDefaultGoalName(userId);
  const summary = payload.horizonYears == null || payload.horizonYears <= 0
    ? `Based on your current savings and the information you shared, your ${goalLabel.toLowerCase()} goal would take about ${resolvedHorizonYears.toFixed(1)} years to reach if you save $${resolvedWeeklyContribution}/week.`
    : `If you redirect around $${toCurrency(annualSavingsFromSuggestions / 52)} each week from suggestions and save $${resolvedWeeklyContribution}/week, you could reach about $${projectedBalanceAfterOneYear} in one year.`;

  return {
    generatedAt: new Date().toISOString(),
    aiStatus: "mock",
    goalType: payload.goalType,
    questionnaireAnswers: {
      goalType: payload.goalType,
      targetAmount: payload.targetAmount,
      horizonYears: payload.horizonYears,
      currentSavings: payload.currentSavings,
      weeklyContribution: payload.weeklyContribution,
    },
    annualRate: BNZ_SAVINGS_ANNUAL_RATE,
    estimatedOneYearGain: toCurrency(projectedBalanceAfterOneYear - payload.currentSavings),
    totalContributionsYear,
    annualSavingsFromSuggestions,
    projectedBalanceAfterOneYear,
    resolvedHorizonYears,
    resolvedWeeklyContribution,
    shortSummary: summary,
    nextStep: `Focus on ${goalLabel.toLowerCase()} with a ${resolvedHorizonYears.toFixed(1)}-year horizon and review progress monthly.`,
    forecast,
  };
}
