import fs from "fs";
import path from "path";
import type { SavingsGoal, Transaction } from "@/lib/wellbeing-types";

type UserProfileId = "alex" | "maya" | "sam";

type UserProfileData = {
  id: UserProfileId;
  label: string;
  csvPath: string;
};

const profiles: UserProfileData[] = [
  { id: "alex", label: "Alex", csvPath: path.join(process.cwd(), "public", "users", "alex.csv") },
  { id: "maya", label: "Maya", csvPath: path.join(process.cwd(), "public", "users", "maya.csv") },
  { id: "sam", label: "Sam", csvPath: path.join(process.cwd(), "public", "users", "sam.csv") },
];

export function getUserProfileId(): UserProfileId {
  if (typeof window === "undefined") {
    return "alex";
  }

  const stored = window.localStorage.getItem("wellbeing-user");
  return (stored === "maya" || stored === "sam" ? stored : "alex") as UserProfileId;
}

export function getUserProfileData(userId: string): UserProfileData {
  const profile = profiles.find((item) => item.id === userId);
  return profile ?? profiles[0];
}

export function loadUserProfileFinancialData(userId: string): { transactions: Transaction[]; savingsGoals: SavingsGoal[] } {
  const profile = getUserProfileData(userId);

  if (!fs.existsSync(profile.csvPath)) {
    return { transactions: [], savingsGoals: [] };
  }

  const csvText = fs.readFileSync(profile.csvPath, "utf8");
  const rows = parseCsv(csvText);

  const transactions: Transaction[] = rows
    .filter((row) => row.record_type === "transaction")
    .map((row) => ({
      id: `txn_${Math.random().toString(36).slice(2, 9)}`,
      date: row.date || "",
      merchant: row.merchant || "",
      category: row.category || "",
      amount: Number(row.amount || 0),
      type: (row.type as Transaction["type"]) || "debit",
      account: row.account || "",
    }));

  const savingsGoals: SavingsGoal[] = rows
    .filter((row) => row.record_type === "goal")
    .map((row) => ({
      name: row.goal_name || "",
      current: Number(row.current || 0),
      target: Number(row.target || 0),
      dueInMonths: Number(row.due_in_months || 0),
      monthlyContribution: Number(row.monthly_contribution || 0),
    }))
    .filter((goal) => goal.name);

  return { transactions, savingsGoals };
}

type CsvRow = Record<string, string>;

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
