"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import moreInfoIcon from "./ui/more-info-icon.png";
import { setStoredUserId, userProfiles } from "@/lib/wellbeing-user";

function UserAvatar({ label, className }: { label: string; className: string }) {
  return (
    <span className={`flex h-9 w-9 items-center justify-center rounded-none border border-white/60 shadow-sm ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
        <path d="M12 12.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 1.75c-4.09 0-7.5 2.43-7.5 5.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5c0-3.07-3.41-5.5-7.5-5.5Z" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function ProfileSwitcher({ activeUserId }: { activeUserId: string }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeUser = userProfiles.find((profile) => profile.id === activeUserId) ?? userProfiles[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowInfo(false);
        setShowProfiles(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowProfiles((current) => !current);
            setShowInfo(false);
          }}
          aria-expanded={showProfiles}
          aria-label="Switch profile"
          className="flex h-9 items-center gap-2 rounded-none border border-[#c7d9ea] bg-[#f7fbfd] px-3 text-[#0C2F59] transition hover:bg-[#e5f2f8]"
        >
          <UserAvatar label={activeUser.label} className={activeUser.avatarClassName} />
          <span className="hidden text-left text-[11px] font-semibold uppercase tracking-[0.18em] md:block">Profiles</span>
          <ChevronDown className={`h-4 w-4 transition ${showProfiles ? "rotate-180" : ""}`} />
        </button>

        {showProfiles && (
          <div className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-[14rem] rounded-none border border-[#c7d9ea] bg-white p-2 text-left shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
            <div className="mb-2 px-2 py-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0C2F59]/55">Switch profile</p>
            </div>
            <div className="space-y-1">
              {userProfiles.map((profile) => {
                const isActive = profile.id === activeUserId;

                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => {
                      setStoredUserId(profile.id);
                      setShowProfiles(false);
                    }}
                    aria-pressed={isActive}
                    aria-label={`Switch to ${profile.label}`}
                    className={`flex w-full items-center gap-2 rounded-none px-2 py-2 text-left transition ${isActive ? "bg-[#eef7fb] text-[#0C2F59]" : "text-[#0C2F59]/70 hover:bg-[#f7fbfd] hover:text-[#0C2F59]"}`}
                  >
                    <UserAvatar label={profile.label} className={profile.avatarClassName} />
                    <span className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0C2F59]/45">Profile</span>
                      <span className="block text-sm font-semibold text-[#0C2F59]">{profile.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setShowInfo((current) => !current);
          setShowProfiles(false);
        }}
        aria-expanded={showInfo}
        aria-label="Show user stories"
        className="flex h-9 items-center gap-2 rounded-none border border-[#c7d9ea] bg-[#f7fbfd] px-3 text-[#0C2F59] transition hover:bg-[#e5f2f8]"
      >
        <Image src={moreInfoIcon} alt="" className="h-4 w-4" priority />
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] md:inline">User stories</span>
      </button>

      {showInfo && (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-[18rem] rounded-none border border-[#c7d9ea] bg-white p-4 text-left shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
          <div className="mb-3 flex items-center justify-between border-b border-[#e3edf5] pb-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0C2F59]/55">User stories</p>
              <p className="text-sm font-semibold text-[#0C2F59]">{activeUser.label}</p>
            </div>
            <span className="rounded-none bg-[#e5f2f8] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C2F59]">
              Dev mode
            </span>
          </div>
          <div className="space-y-3 text-sm text-[#0C2F59]/80">
            <p>{activeUser.description}</p>
            <p className="text-[#0C2F59]/70">User story: {activeUser.story}</p>
          </div>
        </div>
      )}
    </div>
  );
}