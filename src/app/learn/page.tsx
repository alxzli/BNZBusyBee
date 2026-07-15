import { BookOpenCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { learningModules } from "@/lib/mock-data";

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Learn"
        title="Financial education alongside your account view"
        description="The learning hub is intentionally lightweight in this first cut, but the route is ready for more detailed guidance and targeted educational content."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {learningModules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <CardTitle className="pt-3">{module.title}</CardTitle>
              <CardDescription>{module.format}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}