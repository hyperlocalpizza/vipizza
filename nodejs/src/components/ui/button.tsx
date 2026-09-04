import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "icon";
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return <button className={cn("inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-bold transition-colors disabled:pointer-events-none disabled:opacity-50", variant === "default" ? "border-[#c7462d] bg-[#c7462d] text-white hover:bg-[#8f2d20]" : "border-[#eadfd3] bg-transparent text-[#25221f] hover:bg-[#f8e7d5]", size === "icon" && "h-10 w-10 p-0", size === "sm" && "px-3 py-1.5", className)} {...props} />;
}
