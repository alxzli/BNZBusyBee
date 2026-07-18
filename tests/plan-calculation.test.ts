import test from "node:test";
import assert from "node:assert/strict";
import { resolveGoalInputs } from "../src/lib/wellbeing-service.ts";

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
