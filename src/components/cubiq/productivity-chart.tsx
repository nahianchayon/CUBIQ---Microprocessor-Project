import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { mockProductivity } from "@/lib/cubiq/mock-data";
import { cn } from "@/lib/utils";

const ranges = [
  { id: "7d", label: "7 Days", days: 7 },
  { id: "30d", label: "30 Days", days: 30 },
  { id: "3m", label: "3 Months", days: 90 },
] as const;

export function ProductivityChart() {
  const [rangeId, setRangeId] = useState<(typeof ranges)[number]["id"]>("7d");
  const range = ranges.find((r) => r.id === rangeId)!;

  const data = useMemo(() => {
    const base = mockProductivity;
    if (range.days <= 7) {
      return base.map((d) => ({
        label: d.label,
        focus: +(d.focusMinutes / 60).toFixed(2),
        meetings: +(d.meetingMinutes / 60).toFixed(2),
      }));
    }
    // Aggregate weekly buckets for the longer ranges.
    const weeks = Math.round(range.days / 7);
    return Array.from({ length: weeks }, (_, i) => {
      const seed = base[i % base.length]!;
      const factor = 0.75 + ((i * 7) % 5) / 10;
      return {
        label: `W${i + 1}`,
        focus: +((seed.focusMinutes * 5 * factor) / 60).toFixed(2),
        meetings: +((seed.meetingMinutes * 5 * factor) / 60).toFixed(2),
      };
    });
  }, [range]);

  return (
    <section className="surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="label-caps">Productivity overview</h2>
        <div className="flex gap-1 rounded-full bg-secondary p-1" role="tablist" aria-label="Time range">
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={rangeId === r.id}
              onClick={() => setRangeId(r.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                rangeId === r.id
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="meetingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.24} />
                <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--color-muted-foreground)"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              unit="h"
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.75rem",
                fontSize: "0.8125rem",
              }}
              formatter={(value: number, name) => [`${value} h`, name === "focus" ? "Focus" : "Meetings"]}
            />
            <Area
              type="monotone"
              dataKey="focus"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              fill="url(#focusFill)"
            />
            <Area
              type="monotone"
              dataKey="meetings"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              fill="url(#meetingFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-chart-1" /> Focus hours
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-chart-2" /> Meeting hours
        </span>
      </div>
    </section>
  );
}
