import Image from "next/image";
import Link from "next/link";
import { Award, BookOpenText, BrainCircuit, ChartColumnBig, PiggyBank, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Dashboard", icon: ChartColumnBig },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/insights", label: "Insights", icon: BrainCircuit },
  { href: "/savings-plan", label: "Savings Plan", icon: PiggyBank },
  { href: "/projections", label: "Projections", icon: ChartColumnBig },
  { href: "/recommendations", label: "Recommendations", icon: Award },
  { href: "/learn", label: "Learn", icon: BookOpenText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 text-foreground">
                <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
                  <Image src="/imgs/busybee.png" alt="BusyBee logo" width={44} height={44} className="h-full w-full object-cover" />
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight">BNZ BusyBee</span>
                  <span className="block text-sm text-muted-foreground">Banking experience demo</span>
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
                      "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50",
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