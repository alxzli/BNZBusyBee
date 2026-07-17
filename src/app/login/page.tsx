"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

function setStoredUser(userId: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("wellbeing-user", userId);
  document.cookie = `wellbeing-user=${userId}; path=/; max-age=31536000`;
  window.dispatchEvent(new Event("wellbeing-user-changed"));
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("wellbeing-user")) {
      router.replace("/");
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const matchingProfile = profiles.find(
      (profile) => profile.username.toLowerCase() === username.trim().toLowerCase() && profile.password === password,
    );

    if (!matchingProfile) {
      setError("Username or password is incorrect.");
      return;
    }

    setStoredUser(matchingProfile.id);
    router.push("/");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-xl border-[#d5e3ef] bg-white/80">
        <CardHeader className="space-y-3">
          <CardTitle className="text-4xl text-[#0C2F59]">Sign in to BNZ BusyBee</CardTitle>
          <CardDescription className="text-base">
            Access your personalised financial wellbeing dashboard and savings plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
    </div>
  );
}
