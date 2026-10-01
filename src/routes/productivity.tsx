import { createFileRoute } from "@tanstack/react-router";

import { ActivityTimeline } from "@/components/cubiq/activity-timeline";
import { PageHeader, SectionCard } from "@/components/cubiq/primitives";
import { ProtectedRoute } from "@/components/cubiq/protected-route";
import { ProductivityChart } from "@/components/cubiq/productivity-chart";
import { StatCard } from "@/components/cubiq/stat-card";
import { useDevice } from "@/lib/cubiq/device-store";
import { formatMinutes } from "@/lib/cubiq/format";
import { mockProductivity } from "@/lib/cubiq/mock-data";

export const Route = createFileRoute("/productivity")({
  head: () => ({
    meta: [
      { title: "Productivity — CUBIQ" },
      { name: "description", content: "Weekly trends of focus time, meetings and completed sessions." },
      { property: "og:title", content: "Productivity — CUBIQ" },
      { property: "og:description", content: "Weekly trends of focus time, meetings and completed sessions." },
    ],
  }),
  component: ProductivityPage,
});

function ProductivityPage() {
  const { sessions } = useDevice();
  const sum = (k: "focusMinutes" | "meetingMinutes" | "completedSessions" | "recordings") =>
    mockProductivity.reduce((a, d) => a + d[k], 0);

  return (
    <ProtectedRoute>
      <PageHeader title="Productivity" description="How your week with CUBIQ is going." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Focus this week" value={formatMinutes(sum("focusMinutes"))} />
        <StatCard label="Meetings this week" value={formatMinutes(sum("meetingMinutes"))} />
        <StatCard label="Sessions done" value={String(sum("completedSessions"))} />
        <StatCard label="Recordings" value={String(sum("recordings"))} />
      </div>
      <SectionCard title="Trend">
        <ProductivityChart />
      </SectionCard>
      <SectionCard title="All sessions">
        <ActivityTimeline sessions={sessions} />
      </SectionCard>
    </ProtectedRoute>
  );
}
