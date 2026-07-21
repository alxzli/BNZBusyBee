export function getPlanStorageKey(userId: string | null | undefined) {
  return `wellbeing-plan:${userId ?? "alex"}`;
}
