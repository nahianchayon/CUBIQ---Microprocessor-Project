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
    <div className="surface-hover p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <p className="label-caps">{label}</p>
        {icon ? (
          <div className="grid size-8 place-items-center rounded-xl bg-secondary/80 text-muted-foreground border border-border/50 backdrop-blur-md shrink-0">
            {icon}
          </div>
        ) : null}
      </div>
      <div>
        <p className="timer-numeral mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">{value}</p>
        {hint ? (
          <p
            className={cn(
              "mt-2 text-xs font-semibold flex items-center gap-1",
              trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground",
            )}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
