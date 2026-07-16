export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-6 lg:px-10 lg:py-8">
        <main>{children}</main>
      </div>
    </div>
  );
}