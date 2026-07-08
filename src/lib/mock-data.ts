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

export const transactions: Transaction[] = [
  { id: "txn_001", date: "2026-07-01", merchant: "Countdown Metro", category: "Groceries", amount: 124.36, type: "debit", account: "Everyday" },
  { id: "txn_002", date: "2026-07-02", merchant: "BNZ Salary", category: "Income", amount: 3120, type: "credit", account: "Everyday" },
  { id: "txn_003", date: "2026-07-03", merchant: "Z Energy", category: "Transport", amount: 78.2, type: "debit", account: "Everyday" },
  { id: "txn_004", date: "2026-07-03", merchant: "Netflix", category: "Subscriptions", amount: 24.99, type: "debit", account: "Everyday" },
  { id: "txn_005", date: "2026-07-04", merchant: "Southern Cross", category: "Health", amount: 63.5, type: "debit", account: "Everyday" },
  { id: "txn_006", date: "2026-07-04", merchant: "Little Bird Organics", category: "Dining", amount: 42.1, type: "debit", account: "Everyday" },
  { id: "txn_007", date: "2026-07-05", merchant: "KiwiRail", category: "Transport", amount: 19.0, type: "debit", account: "Everyday" },
  { id: "txn_008", date: "2026-07-05", merchant: "Pocket Transfer", category: "Savings", amount: 180, type: "debit", account: "Savings" },
  { id: "txn_009", date: "2026-07-06", merchant: "Auckland Council", category: "Bills", amount: 96.0, type: "debit", account: "Everyday" },
  { id: "txn_010", date: "2026-07-07", merchant: "Trade Me", category: "Shopping", amount: 85.4, type: "debit", account: "Everyday" },
  { id: "txn_011", date: "2026-07-07", merchant: "Freelance Invoice", category: "Income", amount: 640, type: "credit", account: "Everyday" },
  { id: "txn_012", date: "2026-07-08", merchant: "Bean There Cafe", category: "Dining", amount: 14.8, type: "debit", account: "Everyday" },
];

export const monthlySpending = [
  { month: "Feb", spend: 2890, saved: 420 },
  { month: "Mar", spend: 3015, saved: 470 },
  { month: "Apr", spend: 3180, saved: 495 },
  { month: "May", spend: 3325, saved: 510 },
  { month: "Jun", spend: 3610, saved: 528 },
  { month: "Jul", spend: 3842, saved: 540 },
];

export const projectionSeries = [
  { month: "Jul", baseline: 5200, optimized: 5200 },
  { month: "Aug", baseline: 4980, optimized: 5140 },
  { month: "Sep", baseline: 4725, optimized: 5085 },
  { month: "Oct", baseline: 4600, optimized: 5210 },
  { month: "Nov", baseline: 4430, optimized: 5340 },
  { month: "Dec", baseline: 4260, optimized: 5480 },
];

export const categoryBreakdown = [
  { category: "Groceries", amount: 680 },
  { category: "Dining", amount: 420 },
  { category: "Transport", amount: 355 },
  { category: "Bills", amount: 620 },
  { category: "Shopping", amount: 310 },
  { category: "Subscriptions", amount: 75 },
];

export const quickInsights = [
  {
    title: "Subscription creep detected",
    summary: "Recurring digital services climbed 18% over the last 60 days. A bundled plan could save roughly $19 per month.",
  },
  {
    title: "Dining spikes on commute days",
    summary: "Food spend is concentrated on office days. Packing lunch twice a week would free up around $96 monthly for savings goals.",
  },
  {
    title: "Savings momentum is improving",
    summary: "Automatic transfers have increased for four consecutive months. Keeping the current pace would hit the travel fund target two months early.",
  },
];

export const recommendations = [
  "Round up card purchases into the rainy-day pocket until it reaches $1,500.",
  "Cap discretionary dining at $90 per week and redirect the difference to the travel fund.",
  "Move one subscription to annual billing and revisit the second at the end of the quarter.",
];

export const savingsGoals: SavingsGoal[] = [
  { name: "Emergency buffer", current: 3200, target: 5000, dueInMonths: 6, monthlyContribution: 300 },
  { name: "Summer travel", current: 1450, target: 2500, dueInMonths: 5, monthlyContribution: 210 },
  { name: "Course upskilling fund", current: 620, target: 1200, dueInMonths: 4, monthlyContribution: 145 },
];

export const learningModules = [
  {
    id: "learn-1",
    title: "Build a zero-friction budget rhythm",
    format: "5 min read",
    description: "A light-touch weekly routine for checking spending without making budgeting feel punitive.",
  },
  {
    id: "learn-2",
    title: "How to size an emergency fund",
    format: "Interactive guide",
    description: "Translate fixed expenses and income volatility into a realistic target range.",
  },
  {
    id: "learn-3",
    title: "Cash flow forecasting basics",
    format: "7 min lesson",
    description: "Understand the difference between account balance comfort and actual month-end resilience.",
  },
];