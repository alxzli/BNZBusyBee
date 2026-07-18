export type UserProfileId = "alex" | "maya" | "sam";

export type UserProfile = {
  id: UserProfileId;
  label: string;
  title: string;
  description: string;
  story: string;
  avatarClassName: string;
};

export const userProfiles: UserProfile[] = [
  {
    id: "alex",
    label: "Alex",
    title: "Alex - early career saver",
    description: "Balanced spending with a growing emergency fund.",
    story: "Alex opens the app after payday to see whether subscriptions and small daily spends are slowing down progress on a travel fund.",
    avatarClassName: "bg-[#0C2F59] text-white",
  },
  {
    id: "maya",
    label: "Maya",
    title: "Maya - ambitious planner",
    description: "Higher discretionary spend and a stronger travel goal.",
    story: "Maya checks the dashboard before booking a weekend trip and wants to know how much she can keep aside without losing momentum.",
    avatarClassName: "bg-[#0E6A7B] text-white",
  },
  {
    id: "sam",
    label: "Sam",
    title: "Sam - cautious budgeter",
    description: "More fixed bills and a steady savings rhythm.",
    story: "Sam uses the app to spot where the monthly budget can stay predictable while still nudging savings upward in small steps.",
    avatarClassName: "bg-[#8B5E34] text-white",
  },
];

export const defaultUserId: UserProfileId = "alex";
const storageKey = "wellbeing-user";
const cookieName = "wellbeing-user";

function isValidUserId(userId: string | null): userId is UserProfileId {
  return userId === "alex" || userId === "maya" || userId === "sam";
}

export function getStoredUserId(): UserProfileId {
  if (typeof window === "undefined") {
    return defaultUserId;
  }

  const storedUserId = window.localStorage.getItem(storageKey);
  return isValidUserId(storedUserId) ? storedUserId : defaultUserId;
}

export function ensureStoredUserId(): UserProfileId {
  if (typeof window === "undefined") {
    return defaultUserId;
  }

  const storedUserId = window.localStorage.getItem(storageKey);
  if (isValidUserId(storedUserId)) {
    return storedUserId;
  }

  setStoredUserId(defaultUserId);
  return defaultUserId;
}

export function setStoredUserId(userId: UserProfileId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, userId);
  document.cookie = `${cookieName}=${userId}; path=/; max-age=31536000`;
  window.dispatchEvent(new Event("wellbeing-user-changed"));
}

export function getUserProfile(userId: string) {
  return userProfiles.find((profile) => profile.id === userId) ?? userProfiles[0];
}