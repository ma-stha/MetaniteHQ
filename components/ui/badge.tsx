import * as React from "react";
import { cn } from "@/lib/utils";
import type { Band } from "@/lib/scoring";

type Tone = "neutral" | "green" | "amber" | "red" | "blue";

const tones: Record<Tone, string> = {
  neutral: "bg-bg-3 text-text border-line",
  green: "bg-green-dim text-green border-green/30",
  amber: "bg-amber/10 text-amber border-amber/30",
  red: "bg-red/10 text-red border-red/30",
  blue: "bg-blue/10 text-blue border-blue/30",
};

export const bandTone: Record<Band, Tone> = { critical: "red", developing: "amber", strong: "green" };

export function Badge({ tone = "neutral", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
