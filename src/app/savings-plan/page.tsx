import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { savingsGoals } from "@/lib/mock-data";

export default function SavingsPlanPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Savings Plan"
        title="Goals that can turn into guided plans"
        description="The MVP focuses on tangible progress bars and suggested monthly contributions. In a later pass, this page can merge projections, recommendations, and user controls into a richer planner."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {savingsGoals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));

          return (
            <Card key={goal.name}>
              <CardHeader>
                <CardTitle>{goal.name}</CardTitle>
                <CardDescription>{goal.dueInMonths} months remaining</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div className="h-3 rounded-full bg-primary" style={{ width: `${percent}%` }} />
                  </div>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Current</span>
                    <span>${goal.current.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target</span>
                    <span>${goal.target.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suggested monthly transfer</span>
                    <span>${goal.monthlyContribution}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}