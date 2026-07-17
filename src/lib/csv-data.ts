import fs from "fs";
import path from "path";
import type { SavingsGoal, Transaction } from "@/lib/wellbeing-types";

const CSV_PATH = path.join(process.cwd(), "public", "example-user.csv");

type CsvRow = Record<string, string>;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      const nextChar = line[index + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<CsvRow>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}

function toNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  return Number(trimmed);
}

export function loadUserFinancialData(): { transactions: Transaction[]; savingsGoals: SavingsGoal[] } {
  if (!fs.existsSync(CSV_PATH)) {
    return { transactions: [], savingsGoals: [] };
  }

  const csvText = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parseCsv(csvText);

  const transactions: Transaction[] = rows
    .filter((row) => row.record_type === "transaction")
    .map((row) => ({
      id: `txn_${Math.random().toString(36).slice(2, 9)}`,
      date: row.date || "",
      merchant: row.merchant || "",
      category: row.category || "",
      amount: toNumber(row.amount ?? "") ?? 0,
      type: (row.type as Transaction["type"]) || "debit",
      account: row.account || "",
    }));

  const savingsGoals: SavingsGoal[] = rows
    .filter((row) => row.record_type === "goal")
    .map((row) => ({
      name: row.goal_name || "",
      current: toNumber(row.current ?? "") ?? 0,
      target: toNumber(row.target ?? "") ?? 0,
      dueInMonths: toNumber(row.due_in_months ?? "") ?? 0,
      monthlyContribution: toNumber(row.monthly_contribution ?? "") ?? 0,
    }))
    .filter((goal) => goal.name);

  return { transactions, savingsGoals };
}
