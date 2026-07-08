"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardChartsProps = {
  monthlySpending: Array<{ month: string; spend: number; saved: number }>;
};

export function DashboardCharts({ monthlySpending }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Spending trend</CardTitle>
          <CardDescription>Seeded historical pattern for the MVP dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySpending}>
              <defs>
                <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#207a6a" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#207a6a" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#d8ddd8" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={48} />
              <Tooltip />
              <Area type="monotone" dataKey="spend" stroke="#207a6a" fill="url(#spendFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved by month</CardTitle>
          <CardDescription>Quick view of how automatic contributions are trending.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySpending}>
              <CartesianGrid stroke="#e3e5df" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={48} />
              <Tooltip />
              <Bar dataKey="saved" fill="#efac79" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}