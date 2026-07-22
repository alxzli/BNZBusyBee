"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import walkthroughOne from "./1.png";
import walkthroughTwo from "./2.png";
import { ProfileSwitcher } from "@/components/profile-switcher";
import { defaultUserId, ensureStoredUserId, getStoredUserId, type UserProfileId } from "@/lib/wellbeing-user";

type WalkthroughStep = 0 | 1 | 2;

const WALKTHROUGH_REOPEN_EVENT = "bnzbusybee:walkthrough-reopen";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeUserId, setActiveUserId] = useState<UserProfileId>(defaultUserId);
  const [walkthroughActive, setWalkthroughActive] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState<WalkthroughStep>(0);
  const overlayPanelRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (pathname !== "/") {
      setWalkthroughActive(false);
      return;
    }

    setWalkthroughActive(true);
    setWalkthroughStep(0);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const reopenWalkthrough = () => {
      setWalkthroughStep(0);
      setWalkthroughActive(true);
    };

    window.addEventListener(WALKTHROUGH_REOPEN_EVENT, reopenWalkthrough);
    return () => {
      window.removeEventListener(WALKTHROUGH_REOPEN_EVENT, reopenWalkthrough);
    };
  }, [pathname]);

  useEffect(() => {
    if (!walkthroughActive) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [walkthroughActive]);

  useEffect(() => {
    if (!walkthroughActive) {
      overlayPanelRef.current?.focus();
    }
  }, [walkthroughActive]);

  const closeWalkthrough = () => {
    setWalkthroughActive(false);
  };

  const handleOpenShowcaseMenu = () => {
    setWalkthroughStep(2);
  };

  const handleEnterDemo = () => {
    closeWalkthrough();
  };

  const spotlightClasses = {
    1: {
      ring: "left-[0.45%] top-[0.5%] h-[3.6rem] w-[9.4rem] rounded-none",
      hitbox: "left-[0.45%] top-[0.5%] h-[3.6rem] w-[9.4rem] rounded-none",
    },
    2: {
      ring: "left-[0.6%] top-[27.6%] h-[4rem] w-[13.4rem] rounded-none",
      hitbox: "left-[0.6%] top-[27.6%] h-[4rem] w-[13.4rem] rounded-none",
    },
  } as const;

  const panelPositionClasses = {
    0: "left-[52%] top-[50%] max-w-[28rem] -translate-y-1/2",
    1: "left-[2%] top-[8.5%] max-w-[26rem]",
    2: "left-[16.5%] top-[22%] max-w-[27rem]",
  } as const;

  const overlayShadeClass = walkthroughStep === 0 ? "bg-slate-950/38" : "bg-slate-950/62";

  const stepCopy = {
    0: {
      title: "Welcome!",
      message:
        "Welcome to BNZBusyBee, an interactive AI-powered guide that helps everyday people explore BNZ services, set goals, and see future forecasts for their wealth.",
      buttonLabel: "Let's Go!",
      accent: "Quick walkthrough",
    },
    1: {
      title: "Find it in the menu",
      message: "Our app lives in the menu alongside your other features. Click the menu in the top right to continue.",
      accent: "Step 2 of 3",
    },
    2: {
      title: "Open the demo",
      message: "Here it is: BNZ Financial Wellbeing. Select it to move into the demo experience, and use the home screen Back button any time to replay this walkthrough.",
      accent: "Step 3 of 3",
    },
  } as const;

  const activeCopy = stepCopy[walkthroughStep];
  const backgroundImage = walkthroughStep >= 2 ? walkthroughTwo : walkthroughOne;

  return (
    <div className="min-h-screen bg-transparent px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4 px-6 py-3 lg:px-10 lg:py-4">
        <div className="flex justify-end">
          <ProfileSwitcher activeUserId={activeUserId} />
        </div>
        <main>{children}</main>
      </div>

      {walkthroughActive && (
        <div className="fixed inset-0 z-[60] overflow-hidden bg-slate-950">
          <Image src={backgroundImage} alt="" fill className="object-contain object-top" priority />
          <div className={`absolute inset-0 ${overlayShadeClass}`} />

          {walkthroughStep === 1 && (
            <>
              <div className={`pointer-events-none absolute z-[65] border-2 border-[#FFE28A] shadow-[0_0_0_9999px_rgba(2,6,23,0.7)] ${spotlightClasses[1].ring}`} />
              <button
                type="button"
                onClick={handleOpenShowcaseMenu}
                aria-label="Open the walkthrough menu step"
                className={`absolute z-[75] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FFE28A] ${spotlightClasses[1].hitbox}`}
              >
                <span className="sr-only">Open the walkthrough menu step</span>
              </button>
            </>
          )}

          {walkthroughStep === 2 && (
            <>
              <div className={`pointer-events-none absolute z-[65] border-2 border-[#FFE28A] shadow-[0_0_0_9999px_rgba(2,6,23,0.7)] ${spotlightClasses[2].ring}`} />
              <button
                type="button"
                onClick={handleEnterDemo}
                aria-label="Enter the BNZ Financial Wellbeing demo"
                className={`absolute z-[75] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FFE28A] ${spotlightClasses[2].hitbox}`}
              >
                <span className="sr-only">Enter the BNZ Financial Wellbeing demo</span>
              </button>
            </>
          )}

          <div className="relative z-[70] h-full w-full">
            <div
              ref={overlayPanelRef}
              tabIndex={-1}
              className={`absolute w-[min(30rem,calc(100vw-2rem))] rounded-none border border-white/80 bg-[rgba(251,253,255,0.985)] p-6 text-[#08294D] shadow-[0_36px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-8 ${panelPositionClasses[walkthroughStep]}`}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-none border border-[#D8A625]/35 bg-[#FFF3C9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A5A00]">
                <Sparkles className="h-3.5 w-3.5" />
                {activeCopy.accent}
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#08294D]">{activeCopy.title}</h2>
              <p className="mt-3 text-base leading-7 text-[#08294D]/82">{activeCopy.message}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {walkthroughStep === 0 ? (
                  <button
                    type="button"
                    onClick={() => setWalkthroughStep(1)}
                    className="inline-flex items-center gap-2 rounded-none bg-[#0C2F59] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#103c6d]"
                  >
                    {stepCopy[0].buttonLabel}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}