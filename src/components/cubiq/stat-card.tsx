import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down";
  icon?: ReactNode;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="label-caps">{label}</p>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </div>
      <p className="timer-numeral mt-3 text-3xl text-foreground">{value}</p>
      {hint ? (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
