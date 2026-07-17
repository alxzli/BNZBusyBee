"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      const storedUser = localStorage.getItem("wellbeing-user");
      setIsAuthenticated(Boolean(storedUser));
    };

    syncAuthState();

    window.addEventListener("wellbeing-user-changed", syncAuthState);
    window.addEventListener("storage", syncAuthState);
    return () => {
      window.removeEventListener("wellbeing-user-changed", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  function handleSignOut() {
    localStorage.removeItem("wellbeing-user");
    document.cookie = "wellbeing-user=; path=/; max-age=0";
    window.dispatchEvent(new Event("wellbeing-user-changed"));
    router.replace("/login");
  }

  const showHeader = pathname !== "/login";

  return (
    <div className="min-h-screen bg-transparent px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-6 lg:px-10 lg:py-8">
        {showHeader && (
          <header className="flex items-center justify-between rounded-[0.75rem] border border-[#d5e3ef] bg-white/80 px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0C2F59]/70">BNZ BusyBee</p>
              <p className="text-sm text-[#0C2F59]/70">Financial wellbeing demo</p>
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="rounded-[0.625rem] border border-[#d5e3ef] bg-white px-4 py-2 text-sm font-medium text-[#0C2F59] transition hover:bg-[#E5F2F8]"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-[0.625rem] border border-[#7fb8da] bg-[#0C2F59] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a2440]"
              >
                Sign in
              </Link>
            )}
          </header>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}