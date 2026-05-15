import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-sm font-black transition active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-amber/70 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-gradient-to-br from-volt to-amber text-white shadow-glow hover:shadow-[0_0_54px_rgba(255,182,84,0.24)]",
        variant === "secondary" && "border border-line bg-white/8 text-ivory shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/12",
        variant === "ghost" && "text-ivory/75 hover:bg-white/8 hover:text-ivory",
        variant === "danger" && "border border-red-400/30 bg-red-500/15 text-red-100 hover:bg-red-500/25",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
