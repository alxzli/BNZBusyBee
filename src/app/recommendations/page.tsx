import Image from "next/image";
import { ArrowRight, BadgeCheck, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketGrowthChart } from "@/components/market-growth-chart";
import { marketGrowthSeries } from "@/lib/mock-data";

const cardDetails = [
  {
    name: "BNZ Lite Card",
    subtitle: "Blue card",
    imageSrc: "/imgs/lite.png",
    description: "A straightforward everyday card for keeping spending simple and costs predictable.",
    benefits: [
      "Lower-fee structure for everyday spend and routine purchases",
      "Easy to use for groceries, transport, and regular bills",
      "Helpful for customers who want a simple card without too many extras",
    ],
    bestFor: "Best for someone who wants a practical, low-maintenance option for regular day-to-day spending.",
  },
  {
    name: "BNZ Advantage Card",
    subtitle: "Black card",
    imageSrc: "/imgs/advantage.png",
    description: "A more premium-feeling card aimed at customers who want stronger features and more value from higher spend.",
    benefits: [
      "Broader rewards and premium-style benefits for larger or more varied spend",
      "More appealing if you want extra value from travel, dining, or bigger purchases",
      "A stronger fit for customers who want a more feature-rich banking experience",
    ],
    bestFor: "Best for someone who spends more broadly and wants extra perks, rewards, and flexibility.",
  },
];

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recommendations"
        title="Card planning and market recommendations"
        description="A practical view of BNZ card choices, spending fit, and example market growth opportunities for planning your next move."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {cardDetails.map((card) => (
          <Card key={card.name}>
            <CardHeader>
              <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-muted/50 p-3">
                <Image src={card.imageSrc} alt={`${card.name} preview`} width={800} height={500} className="h-auto w-full rounded-[1.2rem] object-cover" />
              </div>
              <div className="mt-4 space-y-2">
                <CardTitle>{card.name}</CardTitle>
                <p className="text-sm font-medium text-slate-300">{card.subtitle}</p>
                <CardDescription>{card.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Benefits</h3>
                <ul className="space-y-2">
                  {card.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2 text-sm text-muted-foreground">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-700">Best fit</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.bestFor}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <TrendingUp className="h-4 w-4" />
            Example recommendation
          </div>
          <CardTitle className="mt-2">Which one should you use?</CardTitle>
          <CardDescription>
            This is just an example suggestion, not a real spending check. It is meant to show how the cards might suit different users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If someone is mostly focused on everyday spend, keeping things simple, and avoiding unnecessary fees, the BNZ Lite Card is a strong fit.
            If someone wants more premium features, stronger rewards, and better value for larger or more varied purchases, the BNZ Advantage Card is the better match.
          </p>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-muted/40 p-4 text-sm text-foreground">
            <span className="font-semibold">Suggested choice:</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">BNZ Lite Card</span>
            <span className="text-muted-foreground">for a simple everyday spend style</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investable market growth</CardTitle>
          <CardDescription>
            Example indexed performance for market exposures you could consider through BNZ investments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarketGrowthChart data={marketGrowthSeries} />
        </CardContent>
      </Card>
    </div>
  );
}
