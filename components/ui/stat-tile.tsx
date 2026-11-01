import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "neutral" | "green" | "amber" | "red";
}) {
  const valueColor = { neutral: "text-white", green: "text-green", amber: "text-amber", red: "text-red" }[tone];
  return (
    <div className="rounded-sm border border-line bg-bg-2 px-5 py-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className={cn("font-display tabular mt-2 text-3xl font-bold", valueColor)}>{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </div>
  );
}
