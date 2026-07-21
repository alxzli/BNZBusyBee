export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: "debit" | "credit";
  account: string;
};

export type SavingsGoal = {
  name: string;
  current: number;
  target: number;
  dueInMonths: number;
  monthlyContribution: number;
};

export type SavingsSuggestionType = "subscription" | "dining" | "fee" | "idle_cash";

export type SuggestionEvidence = {
  label: string;
  value: string;
};

export type SavingsSuggestion = {
  id: string;
  title: string;
  reason: string;
  type: SavingsSuggestionType;
  weeklySavings: number;
  monthlySavings: number;
  annualSavings: number;
  confidence: "high" | "medium";
  evidence: SuggestionEvidence[];
  actionLabel: string;
};

export type ForecastPoint = {
  date: string;
  month: string;
  projectedBalance: number;
  contributed: number;
  interestEarned: number;
};

export type AiStatus = "live" | "fallback" | "mock";

export type AiMetadata = {
  modelId: string | null;
  fallbackReason?: string;
};

export type WellbeingDashboardResponse = {
  generatedAt: string;
  aiStatus: AiStatus;
  aiMetadata?: AiMetadata;
  title: string;
  suggestionsHeadline: string;
  suggestions: SavingsSuggestion[];
  goalMode: "hero" | "forecast";
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
  };
};

export type WellbeingSuggestionsResponse = {
  generatedAt: string;
  aiStatus: AiStatus;
  aiMetadata?: AiMetadata;
  annualSavingsTotal: number;
  suggestions: SavingsSuggestion[];
};

export type PlanRequest = {
  goalType: string;
  targetAmount: number;
  horizonYears: number | null;
  currentSavings: number;
  weeklyContribution: number | null;
};

export type PlanResponse = {
  generatedAt: string;
  aiStatus: AiStatus;
  aiMetadata?: AiMetadata;
  goalType: string;
  questionnaireAnswers: PlanRequest;
  annualRate: number;
  estimatedOneYearGain: number;
  totalContributionsYear: number;
  annualSavingsFromSuggestions: number;
  projectedBalanceAfterOneYear: number;
  resolvedHorizonYears: number;
  resolvedWeeklyContribution: number;
  shortSummary: string;
  nextStep: string;
  forecast: ForecastPoint[];
};
