import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#007CBB] px-5 py-3 text-[#FFFFFF] hover:bg-[#006ea7] shadow-none",
        secondary:
          "border border-[#c5d9e9] bg-[#FFFFFF] px-5 py-3 text-[#0C2F59] hover:bg-[#f7fbfd]",
        ghost: "px-4 py-2 text-[#0C2F59] hover:bg-[#E5F2F8]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export { buttonVariants };