"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserProfile = {
  id: string;
  label: string;
  title: string;
  description: string;
  username: string;
  password: string;
};

const profiles: UserProfile[] = [
  {
    id: "alex",
    label: "Alex",
    title: "Alex - early career saver",
    description: "Balanced spending with a growing emergency fund.",
    username: "alex",
    password: "alex123",
  },
  {
    id: "maya",
    label: "Maya",
    title: "Maya - ambitious planner",
    description: "Higher discretionary spend and a stronger travel goal.",
    username: "maya",
    password: "maya123",
  },
  {
    id: "sam",
    label: "Sam",
    title: "Sam - cautious budgeter",
    description: "More fixed bills and a steady savings rhythm.",
    username: "sam",
    password: "sam123",
  },
];

function readStoredUser(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("wellbeing-user") || null;
}

function setStoredUser(userId: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("wellbeing-user", userId);
  document.cookie = `wellbeing-user=${userId}; path=/; max-age=31536000`;
  window.dispatchEvent(new Event("wellbeing-user-changed"));
}

function clearStoredUser() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("wellbeing-user");
  document.cookie = "wellbeing-user=; path=/; max-age=0";
  window.dispatchEvent(new Event("wellbeing-user-changed"));
}

export function AuthMenu() {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = readStoredUser();
    const initialUser = profiles.find((profile) => profile.id === storedUser) ?? null;
    if (initialUser) {
      setActiveUser(initialUser);
    }
  }, []);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const matchingProfile = profiles.find(
      (profile) => profile.username.toLowerCase() === username.trim().toLowerCase() && profile.password === password,
    );

    if (!matchingProfile) {
      setError("Username or password is incorrect.");
      return;
    }

    setActiveUser(matchingProfile);
    setStoredUser(matchingProfile.id);
    setError("");
    setPassword("");
  }

  function handleLogout() {
    setActiveUser(null);
    clearStoredUser();
    setUsername("");
    setPassword("");
    setError("");
  }

  if (!activeUser) {
    return (
      <Card className="border-[#d5e3ef] bg-white/80">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-[#0C2F59]">Welcome back</CardTitle>
          <CardDescription className="text-base">Sign in to load your personal budget and savings profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0C2F59]" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-[0.625rem] border border-[#d5e3ef] bg-[#E5F2F8] px-4 py-3 text-[#0C2F59] outline-none focus:border-[#7fb8da]"
                placeholder="alex"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0C2F59]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[0.625rem] border border-[#d5e3ef] bg-[#E5F2F8] px-4 py-3 text-[#0C2F59] outline-none focus:border-[#7fb8da]"
                placeholder="alex123"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-sm text-[#0C2F59]/70">Demo credentials: alex / alex123, maya / maya123, sam / sam123</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#d5e3ef] bg-white/80">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-[#0C2F59]">Signed in as {activeUser.label}</CardTitle>
        <CardDescription className="text-base">
          {activeUser.title}. {activeUser.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {profiles.map((profile) => (
            <Button
              key={profile.id}
              variant={activeUser.id === profile.id ? "default" : "secondary"}
              onClick={() => {
                setActiveUser(profile);
                setStoredUser(profile.id);
              }}
            >
              {profile.label}
            </Button>
          ))}
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Sign out
        </Button>
      </CardContent>
    </Card>
  );
}
