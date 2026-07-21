"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import moreInfoIcon from "./ui/more-info-icon.png";
import { setStoredUserId, userProfiles } from "@/lib/wellbeing-user";

function UserAvatar({ label, isActive }: { label: string; isActive: boolean }) {
  const avatarClassName = isActive
    ? "bg-[#0C2F59] text-white border-white/60"
    : "bg-[#e9eef4] text-[#8da0b4] border-[#d4dee8]";

  return (
    <span className={`flex h-9 w-9 items-center justify-center rounded-[0.6rem] border shadow-sm transition-colors ${avatarClassName}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M12 12.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 1.75c-4.09 0-7.5 2.43-7.5 5.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5c0-3.07-3.41-5.5-7.5-5.5Z" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function ProfileSwitcher({ activeUserId }: { activeUserId: string }) {
  const [showInfo, setShowInfo] = useState(false);
  const infoPanelRef = useRef<HTMLDivElement | null>(null);
  const activeUser = userProfiles.find((profile) => profile.id === activeUserId) ?? userProfiles[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (infoPanelRef.current && !infoPanelRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={infoPanelRef} className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setShowInfo((current) => !current)}
        aria-expanded={showInfo}
        aria-label="Show user stories"
        className="flex h-9 items-center gap-2 rounded-[0.65rem] border border-[#c7d9ea] bg-[#f7fbfd] px-3 text-[#0C2F59] transition hover:bg-[#e5f2f8]"
      >
        <Image src={moreInfoIcon} alt="" className="h-4 w-4" priority />
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] md:inline">User stories</span>
      </button>

      {showInfo && (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-[18rem] rounded-[0.8rem] border border-[#c7d9ea] bg-white p-4 text-left shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
          <div className="mb-3 flex items-center justify-between border-b border-[#e3edf5] pb-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0C2F59]/55">User stories</p>
              <p className="text-sm font-semibold text-[#0C2F59]">{activeUser.label}</p>
            </div>
            <span className="rounded-full bg-[#e5f2f8] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C2F59]">
              Dev mode
            </span>
          </div>
          <div className="space-y-3 text-sm text-[#0C2F59]/80">
            <p>{activeUser.description}</p>
            <p className="text-[#0C2F59]/70">User story: {activeUser.story}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-[0.85rem] border border-[#c7d9ea] bg-[#f7fbfd] px-2 py-1 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
        <span className="hidden rounded-full bg-[#0C2F59] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white md:inline-flex">
          Profiles
        </span>
        {userProfiles.map((profile) => {
          const isActive = profile.id === activeUserId;

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => setStoredUserId(profile.id)}
              aria-pressed={isActive}
              aria-label={`Switch to ${profile.label}`}
              className={`flex items-center gap-2 rounded-[0.65rem] px-2 py-1.5 text-left transition ${isActive ? "bg-white ring-1 ring-[#7fb8da] shadow-sm" : "text-[#0C2F59]/70 hover:bg-white/70 hover:text-[#0C2F59]"}`}
            >
              <UserAvatar label={profile.label} isActive={isActive} />
              <span className="hidden min-w-0 md:block">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0C2F59]/45">Profile</span>
                <span className="block text-sm font-semibold text-[#0C2F59]">{profile.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}