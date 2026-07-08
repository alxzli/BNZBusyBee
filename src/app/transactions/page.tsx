import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions } from "@/lib/mock-data";

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Transactions"
        title="Pre-loaded data for instant demo depth"
        description="This view starts with mock account activity so the product story works immediately. Filters, search, and real ingestion can be added in the next pass without changing the page structure."
      />

      <Card>
        <CardHeader>
          <CardTitle>Transaction feed</CardTitle>
          <CardDescription>Structured to become the primary table or timeline once live bank data is connected.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="grid gap-3 rounded-2xl border border-border/70 bg-muted/40 p-4 md:grid-cols-[1.2fr_0.8fr_0.6fr_0.5fr] md:items-center">
              <div>
                <p className="font-medium">{transaction.merchant}</p>
                <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.account}</p>
              </div>
              <div>
                <Badge variant="outline" className="w-fit">
                  {transaction.category}
                </Badge>
              </div>
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{transaction.type}</p>
              <p className="text-right font-semibold">${transaction.amount.toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}