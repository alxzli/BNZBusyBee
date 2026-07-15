"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MarketGrowthChartProps = {
  data: Array<{ month: string; sp500: number; nasdaq: number; global: number }>;
};

export function MarketGrowthChart({ data }: MarketGrowthChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#d8ddd8" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={48} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sp500" stroke="#207a6a" strokeWidth={3} dot={false} name="S&P 500" />
          <Line type="monotone" dataKey="nasdaq" stroke="#dc6f4f" strokeWidth={3} dot={false} name="NASDAQ 100" />
          <Line type="monotone" dataKey="global" stroke="#7c3aed" strokeWidth={3} dot={false} name="Global Equities" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
