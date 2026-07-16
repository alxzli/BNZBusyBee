"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ForecastPoint } from "@/lib/wellbeing-types";

type GoalForecastChartProps = {
  data: ForecastPoint[];
};

export function GoalForecastChart({ data }: GoalForecastChartProps) {
  return (
    <div className="h-[280px] w-full rounded-[0.625rem] border border-[#d5e3ef] bg-[#E5F2F8] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbe2ea" />
          <XAxis dataKey="month" stroke="#5f6f82" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis stroke="#5f6f82" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `$${value}`} width={72} />
          <Tooltip
            cursor={{ stroke: "#0f172a", strokeOpacity: 0.1 }}
            contentStyle={{ borderRadius: 8, border: "1px solid #cfd9e3", background: "#ffffff" }}
            formatter={(value) => {
              const numeric = typeof value === "number" ? value : Number(value ?? 0);
              return [`$${numeric.toFixed(0)}`, "Projected"];
            }}
          />
          <Line type="monotone" dataKey="projectedBalance" stroke="#163c70" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
