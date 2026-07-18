"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ensureStoredUserId, getStoredUserId } from "@/lib/wellbeing-user";
import { ProfileSwitcher } from "@/components/profile-switcher";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [activeUserId, setActiveUserId] = useState(getStoredUserId());
  useEffect(() => {
    const syncAuthState = () => {
      setActiveUserId(getStoredUserId());
    };

    syncAuthState();
    setActiveUserId(ensureStoredUserId());
    window.addEventListener("wellbeing-user-changed", syncAuthState);
    window.addEventListener("storage", syncAuthState);
    return () => {
      window.removeEventListener("wellbeing-user-changed", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4 px-6 py-3 lg:px-10 lg:py-4">
        <header className="flex items-center rounded-[0.75rem] border border-[#d5e3ef] bg-white/80 px-4 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <Link href="/" className="group">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0C2F59]/70 transition group-hover:text-[#0C2F59]">BNZ BusyBee</p>
            <p className="text-sm text-[#0C2F59]/70">Financial wellbeing demo</p>
          </Link>
          <div className="ml-auto flex items-center">
            <ProfileSwitcher activeUserId={activeUserId} />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}