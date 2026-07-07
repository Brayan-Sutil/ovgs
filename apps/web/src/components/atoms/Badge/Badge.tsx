import { HTMLAttributes } from "react";
import clsx from "clsx";

type BadgeTone = "neutral" | "success" | "warning" | "info" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-sky-100 text-sky-800",
  danger: "bg-red-100 text-red-800"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex min-h-6 items-center rounded px-2 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
