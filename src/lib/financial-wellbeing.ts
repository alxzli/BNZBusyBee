export type GoalType =
  | "House deposit"
  | "Car"
  | "Child's education"
  | "Wedding"
  | "Emergency fund"
  | "Pay off debt"
  | "Retirement top-up"
  | "Travel"
  | "Just save more";

export type ProductRecommendation = {
  name: string;
  reason: string;
};

export type GoalMilestone = {
  id: string;
  label: string;
  targetAmount: number;
  targetDate: string;
  completed: boolean;
  progress: number;
};

export type Goal = {
  id: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdDate: string;
  monthlyContributionNeeded: number;
  milestones: GoalMilestone[];
  linkedProduct: ProductRecommendation;
};

export type TimeframeOption = {
  id: string;
  label: string;
  months: number;
};

export const ASSUMED_MONTHLY_CAPACITY = 900;

export const goalTypeOptions: GoalType[] = [
  "House deposit",
  "Car",
  "Child's education",
  "Wedding",
  "Emergency fund",
  "Pay off debt",
  "Retirement top-up",
  "Travel",
  "Just save more",
];

export const timeframeOptions: TimeframeOption[] = [
  { id: "6_months", label: "6 months", months: 6 },
  { id: "1_year", label: "1 year", months: 12 },
  { id: "2_years", label: "2 years", months: 24 },
  { id: "5_plus_years", label: "5+ years", months: 60 },
];

export const defaultGoalTargetAmounts: Record<GoalType, number> = {
  "House deposit": 50000,
  Car: 15000,
  "Child's education": 20000,
  Wedding: 18000,
  "Emergency fund": 10000,
  "Pay off debt": 8000,
  "Retirement top-up": 25000,
  Travel: 6000,
  "Just save more": 5000,
};

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatDateISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function monthsUntil(targetDate: string, fromDate = new Date()) {
  const target = new Date(targetDate);
  const monthDiff = (target.getFullYear() - fromDate.getFullYear()) * 12 + (target.getMonth() - fromDate.getMonth());
  const partialMonth = target.getDate() >= fromDate.getDate() ? 0 : 1;
  return Math.max(1, monthDiff - partialMonth + 1);
}

export function calculateMonthlyContribution(targetAmount: number, currentAmount: number, targetDate: string, fromDate = new Date()) {
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);
  const remainingMonths = monthsUntil(targetDate, fromDate);
  return roundCurrency(remainingAmount / remainingMonths);
}

function milestoneLabel(goalType: GoalType, progress: number) {
  if (progress === 1) {
    return `Ready for your ${goalType.toLowerCase()}.`;
  }

  if (progress === 0.75) {
    return `Three quarters toward your ${goalType.toLowerCase()}.`;
  }

  if (progress === 0.5) {
    return `Halfway to your ${goalType.toLowerCase()}.`;
  }

  return `First milestone for your ${goalType.toLowerCase()}.`;
}

export function generateMilestones(goal: Pick<Goal, "goalType" | "targetAmount" | "currentAmount" | "targetDate" | "createdDate" | "monthlyContributionNeeded">) {
  const progressSteps = [0.25, 0.5, 0.75, 1];
  const createdAt = new Date(goal.createdDate);
  const targetAt = new Date(goal.targetDate);

  return progressSteps.map((progress) => {
    const milestoneAmount = roundCurrency(goal.targetAmount * progress);
    const remainingAmount = Math.max(milestoneAmount - goal.currentAmount, 0);
    const monthsToMilestone = goal.monthlyContributionNeeded > 0 ? Math.ceil(remainingAmount / goal.monthlyContributionNeeded) : 0;
    const projectedDate = addMonths(createdAt, monthsToMilestone);
    const targetDate = projectedDate > targetAt ? targetAt : projectedDate;

    return {
      id: `${goal.goalType}-${progress}`,
      label: milestoneLabel(goal.goalType, progress),
      targetAmount: milestoneAmount,
      targetDate: formatDateISO(targetDate),
      completed: goal.currentAmount >= milestoneAmount,
      progress,
    };
  });
}

export function suggestTimeframe(targetAmount: number, assumedMonthlyCapacity: number, currentAmount = 0, fromDate = new Date()) {
  const safeCapacity = Math.max(assumedMonthlyCapacity, 1);
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);
  const months = Math.max(6, Math.ceil(remainingAmount / safeCapacity));
  const targetDate = formatDateISO(addMonths(fromDate, months));

  return { months, targetDate };
}

export function recommendProduct(goalType: GoalType, timeframeInMonths: number): ProductRecommendation {
  if (timeframeInMonths < 24) {
    return {
      name: "Rapid Save or Term Deposit",
      reason: "Shorter timelines usually suit cash-focused options that keep the money accessible.",
    };
  }

  if (goalType === "Child's education" || goalType === "Retirement top-up") {
    return {
      name: "KiwiSaver or Managed Funds",
      reason: "Longer education and retirement goals usually benefit from growth-focused investing.",
    };
  }

  if (timeframeInMonths >= 60) {
    return {
      name: "Managed Funds",
      reason: "A longer runway gives market-based options more time to smooth out short-term swings.",
    };
  }

  return {
    name: "Notice Saver",
    reason: "Mid-range goals often need a balance between access and a better return than an everyday account.",
  };
}

export function createGoal(input: { id: string; goalType: GoalType; targetAmount: number; currentAmount: number; targetDate: string; createdDate?: string }) {
  const createdDate = input.createdDate ?? formatDateISO(new Date());
  const monthlyContributionNeeded = calculateMonthlyContribution(input.targetAmount, input.currentAmount, input.targetDate, new Date(createdDate));
  const linkedProduct = recommendProduct(input.goalType, monthsUntil(input.targetDate, new Date(createdDate)));

  const baseGoal = {
    id: input.id,
    goalType: input.goalType,
    targetAmount: input.targetAmount,
    currentAmount: input.currentAmount,
    targetDate: input.targetDate,
    createdDate,
    monthlyContributionNeeded,
    linkedProduct,
    milestones: [] as GoalMilestone[],
  };

  return {
    ...baseGoal,
    milestones: generateMilestones(baseGoal),
  } satisfies Goal;
}

export function rebuildGoal(goal: Goal) {
  return createGoal({
    id: goal.id,
    goalType: goal.goalType,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    targetDate: goal.targetDate,
    createdDate: goal.createdDate,
  });
}

export function whatIfCalculator(goal: Goal, extraMonthlyAmount: number, fromDate = new Date()) {
  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const projectedMonthlyAmount = Math.max(goal.monthlyContributionNeeded + Math.max(extraMonthlyAmount, 0), 1);
  const months = remainingAmount === 0 ? 0 : Math.ceil(remainingAmount / projectedMonthlyAmount);
  const targetDate = remainingAmount === 0 ? formatDateISO(fromDate) : formatDateISO(addMonths(fromDate, months));

  return {
    months,
    targetDate,
  };
}

export function assessGoalAmbition(targetAmount: number, currentAmount: number, targetDate: string, assumedMonthlyCapacity = ASSUMED_MONTHLY_CAPACITY, fromDate = new Date()) {
  const requiredMonthlyAmount = calculateMonthlyContribution(targetAmount, currentAmount, targetDate, fromDate);
  const ambitious = requiredMonthlyAmount > assumedMonthlyCapacity * 1.8;

  if (!ambitious) {
    return {
      ambitious: false,
      requiredMonthlyAmount,
    };
  }

  const suggestedTimeframeResult = suggestTimeframe(targetAmount, assumedMonthlyCapacity, currentAmount, fromDate);
  const suggestedTargetAmount = roundCurrency(currentAmount + monthsUntil(targetDate, fromDate) * assumedMonthlyCapacity);

  return {
    ambitious: true,
    requiredMonthlyAmount,
    suggestedTimeframeMonths: suggestedTimeframeResult.months,
    suggestedTimeframeDate: suggestedTimeframeResult.targetDate,
    suggestedTargetAmount,
  };
}

export const seededGoals = [
  createGoal({
    id: "goal_emergency_buffer",
    goalType: "Emergency fund",
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: formatDateISO(addMonths(new Date(), 6)),
  }),
  createGoal({
    id: "goal_travel",
    goalType: "Travel",
    targetAmount: 2500,
    currentAmount: 1450,
    targetDate: formatDateISO(addMonths(new Date(), 5)),
  }),
  createGoal({
    id: "goal_car",
    goalType: "Car",
    targetAmount: 15000,
    currentAmount: 2500,
    targetDate: formatDateISO(addMonths(new Date(), 24)),
  }),
];