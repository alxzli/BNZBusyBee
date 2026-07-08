import { ProjectionChart } from "@/components/projection-chart";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectionSeries } from "@/lib/mock-data";

export default function ProjectionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projections"
        title="Show the impact of better choices before building a full simulator"
        description="This starter includes a simple baseline-versus-optimized view. Later, assumptions, scenario controls, and persistence can expand this into a more interactive planning experience."
      />

      <Card>
        <CardHeader>
          <CardTitle>Six-month cash flow outlook</CardTitle>
          <CardDescription>The optimized line assumes lighter discretionary spend and steadier automated savings behavior.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectionChart data={projectionSeries} />
        </CardContent>
      </Card>
    </div>
  );
}