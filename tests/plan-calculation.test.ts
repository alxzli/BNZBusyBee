import test from "node:test";
import assert from "node:assert/strict";
import { buildPlanFromQuestionnaire, resolveGoalInputs } from "../src/lib/wellbeing-service";
import { buildFormStateFromPlan } from "../src/lib/questionnaire-form";
import { getPlanStorageKey } from "../src/lib/user-storage";

test("derives missing horizon and weekly contribution from the other inputs", () => {
  const result = resolveGoalInputs(
    {
      goalType: "House deposit",
      targetAmount: 50000,
      horizonYears: null,
      currentSavings: 2000,
      weeklyContribution: null,
    },
    1200,
  );

  assert.ok(result.resolvedHorizonYears > 0);
  assert.ok(result.resolvedWeeklyContribution > 0);
});

test("uses the current date as the first forecast point", () => {
  const today = new Date();
  const result = buildPlanFromQuestionnaire(
    {
      goalType: "House deposit",
      targetAmount: 50000,
      horizonYears: 5,
      currentSavings: 2000,
      weeklyContribution: 40,
    },
    "alex",
  );

  const firstPointDate = result.forecast[0]?.date;
  assert.ok(firstPointDate, "forecast should include a date for the first point");

  const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  assert.equal(firstPointDate, expectedDate);
});

test("restores questionnaire answers from a saved plan", () => {
  const formState = buildFormStateFromPlan({
    goalType: "House deposit",
    targetAmount: 50000,
    horizonYears: 3,
    currentSavings: 2000,
    weeklyContribution: 40,
  });

  assert.deepEqual(formState, {
    goalType: "House deposit",
    targetAmount: "50000",
    horizonYears: "3",
    currentSavings: "2000",
    weeklyContribution: "40",
  });
});

test("uses blank values when questionnaire answers are missing", () => {
  const formState = buildFormStateFromPlan({ goalType: "" });

  assert.equal(formState.goalType, "");
  assert.equal(formState.targetAmount, "");
  assert.equal(formState.horizonYears, "");
  assert.equal(formState.currentSavings, "");
  assert.equal(formState.weeklyContribution, "");
});

test("stores a plan under a user-specific storage key", () => {
  assert.equal(getPlanStorageKey("alex"), "wellbeing-plan:alex");
  assert.equal(getPlanStorageKey("maya"), "wellbeing-plan:maya");
});
