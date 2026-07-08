"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ProjectionChartProps = {
  data: Array<{ month: string; baseline: number; optimized: number }>;
};

export function ProjectionChart({ data }: ProjectionChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#d8ddd8" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={52} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="baseline" stroke="#dc6f4f" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="optimized" stroke="#207a6a" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}