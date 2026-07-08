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
    label: "Spend this month",
    value: "$3,842",
    note: "+6.4% vs last month",
    icon: Wallet,
  },
  {
    label: "Saved automatically",
    value: "$540",
    note: "72% of August goal",
    icon: PiggyBank,
  },
  {
    label: "Carbon-light purchases",
    value: "64%",
    note: "4 greener choices identified",
    icon: Leaf,
  },
];

const roadmap = [
  "Replace mock transaction loader with Open Banking or CSV import.",
  "Switch recommendation routes to Bedrock-generated plans when AWS credentials are configured.",
  "Add auth, user profiles, and persisted goals once the demo flow is approved.",
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Hackathon MVP"
        title="Financial clarity that feels immediate"
        description="BusyBee starts with pre-loaded transactions, quick behavioral insights, and savings nudges. This base app is wired for Bedrock-backed APIs and ready to evolve into a fuller banking demo."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/transactions" className={buttonVariants({ className: "px-5 py-3" })}>
              Explore transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/insights" className={buttonVariants({ variant: "secondary", className: "px-5 py-3" })}>
              Review insights
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
            <Badge className="w-fit">AI-ready feed</Badge>
            <CardTitle className="mt-3">Top emerging insights</CardTitle>
            <CardDescription>
              These are seeded from mock data today and can be replaced by Bedrock-generated summaries from the analyze API route.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickInsights.map((insight) => (
              <div key={insight.title} className="rounded-2xl bg-muted p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
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
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>Mock data gives the demo immediate depth before bank integrations are available.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-white/70 p-4">
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
            <CardTitle>Starter roadmap</CardTitle>
            <CardDescription>What this baseline intentionally leaves open for the next iteration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadmap.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-muted p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
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
