import Link from "next/link";
import { ArrowRight, BrainCircuit, Leaf, PiggyBank, Wallet } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { monthlySpending, quickInsights, transactions } from "@/lib/mock-data";

const metrics = [
  {
    label: "Monthly spend",
    value: "$3,842",
    note: "Up 6.4% against the prior month",
    icon: Wallet,
  },
  {
    label: "Automated savings",
    value: "$540",
    note: "72% of your August target reached",
    icon: PiggyBank,
  },
  {
    label: "Lower-impact purchases",
    value: "64%",
    note: "Four more choices aligned with your goals",
    icon: Leaf,
  },
];

const roadmap = [
  "Connect live transaction data through Open Banking or a secure file import flow.",
  "Replace seeded recommendations with richer account-linked guidance once live data access is available.",
  "Add personalisation, saved goals, and richer account insights for a more complete banking experience.",
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="BNZ banking experience"
        title="Financial clarity that feels immediate"
        description="BusyBee brings together recent activity, practical savings ideas, and a clear view of progress so you can make more confident decisions."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/transactions" className={buttonVariants({ className: "px-5 py-3" })}>
              View transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/insights" className={buttonVariants({ variant: "secondary", className: "px-5 py-3" })}>
              Explore insights
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="mt-3 text-3xl">{metric.value}</CardTitle>
                </div>
                <div className="rounded-full bg-secondary p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{metric.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <DashboardCharts monthlySpending={monthlySpending} />

        <Card>
          <CardHeader>
            <Badge className="w-fit">Latest insights</Badge>
            <CardTitle className="mt-3">What stands out right now</CardTitle>
            <CardDescription>
              These observations are seeded today, and they can later be replaced by richer summaries from your connected account data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickInsights.map((insight) => (
              <div key={insight.title} className="rounded-2xl bg-muted p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <BrainCircuit className="h-4 w-4" />
                  {insight.title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{insight.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>A clear snapshot of recent movement while live banking integrations are still being introduced.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-accent/10 p-4">
                  <div>
                    <p className="font-medium">{transaction.merchant}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category} • {transaction.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${transaction.amount.toFixed(2)}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product roadmap</CardTitle>
            <CardDescription>The next steps that would turn this experience into a fuller, more personalised banking product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadmap.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-muted p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
