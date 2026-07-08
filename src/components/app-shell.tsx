import Link from "next/link";
import { BookOpenText, BrainCircuit, ChartColumnBig, Flower2, PiggyBank, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Dashboard", icon: ChartColumnBig },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/insights", label: "Insights", icon: BrainCircuit },
  { href: "/savings-plan", label: "Savings Plan", icon: PiggyBank },
  { href: "/projections", label: "Projections", icon: ChartColumnBig },
  { href: "/learn", label: "Learn", icon: BookOpenText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/60 bg-shell shadow-panel">
        <header className="border-b border-border/70 px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 text-foreground">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Flower2 className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight">BNZ BusyBee</span>
                  <span className="block text-sm text-muted-foreground">Financial wellness demo starter</span>
                </span>
              </Link>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:border-border hover:bg-white/80 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}