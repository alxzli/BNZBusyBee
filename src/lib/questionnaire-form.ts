export type QuestionnaireFormState = {
  goalType: string;
  targetAmount: string;
  horizonYears: string;
  currentSavings: string;
  weeklyContribution: string;
};

export type QuestionnaireValues = {
  goalType: string;
  targetAmount: number | null;
  horizonYears: number | null;
  currentSavings: number | null;
  weeklyContribution: number | null;
};

export function buildFormStateFromPlan(values: Partial<QuestionnaireValues> & { goalType?: string }): QuestionnaireFormState {
  return {
    goalType: values.goalType ?? "",
    targetAmount: values.targetAmount == null ? "" : String(values.targetAmount),
    horizonYears: values.horizonYears == null ? "" : String(values.horizonYears),
    currentSavings: values.currentSavings == null ? "" : String(values.currentSavings),
    weeklyContribution: values.weeklyContribution == null ? "" : String(values.weeklyContribution),
  };
}
