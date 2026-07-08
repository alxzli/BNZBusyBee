import { BrainCircuit, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { quickInsights, recommendations } from "@/lib/mock-data";

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Insights"
        title="A clear shell for AI-generated coaching"
        description="The layout is ready for Bedrock summaries and recommendation flows. For now it uses stable seeded content so the demo narrative is predictable and polished."
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Behavior signals</CardTitle>
            <CardDescription>These cards can later map one-to-one with `/api/analyze` responses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickInsights.map((insight) => (
              <div key={insight.title} className="rounded-2xl bg-muted p-5">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <BrainCircuit className="h-4 w-4" />
                  {insight.title}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{insight.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge className="w-fit">Recommendations</Badge>
            <CardTitle className="mt-3">Action queue</CardTitle>
            <CardDescription>Designed for short, high-confidence savings nudges suitable for a banking demo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-border/70 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}