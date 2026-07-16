import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type PageBackButtonProps = {
  mode: "static" | "toHome";
};

export function PageBackButton({ mode }: PageBackButtonProps) {
  const className = "fixed left-4 top-3 z-50 inline-flex items-center gap-1 text-lg font-medium text-[#0C2F59]";

  if (mode === "toHome") {
    return (
      <Link href="/" className={className}>
        <ChevronLeft className="h-5 w-5" />
        Back
      </Link>
    );
  }

  return (
    <button type="button" className={`${className} cursor-default`}>
      <ChevronLeft className="h-5 w-5" />
      Back
    </button>
  );
}