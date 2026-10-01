import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Clock, ListChecks, Mic } from "lucide-react";

import { ActivityTimeline } from "@/components/cubiq/activity-timeline";
import { CurrentActivityCard } from "@/components/cubiq/current-activity";
import { DeviceVisual } from "@/components/cubiq/device-visual";
import { PageHeader, SectionCard } from "@/components/cubiq/primitives";
import { ProductivityChart } from "@/components/cubiq/productivity-chart";
import { StatCard } from "@/components/cubiq/stat-card";
import { useDevice } from "@/lib/cubiq/device-store";
import { formatDuration } from "@/lib/cubiq/format";
import { mockTasks } from "@/lib/cubiq/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CUBIQ" },
      { name: "description", content: "Live status of your CUBIQ device, today's focus time and meetings." },
      { property: "og:title", content: "Dashboard — CUBIQ" },
      { property: "og:description", content: "Live status of your CUBIQ device, today's focus time and meetings." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { sessions } = useDevice();
  const focus = sessions.filter((s) => s.type === "focus");
  const meetings = sessions.filter((s) => s.type === "meeting");
  const focusTotal = focus.reduce((a, s) => a + s.durationSeconds, 0);
  const open = mockTasks.filter((t) => t.status === "open").length;

  return (
    <>
      <PageHeader title="Dashboard" description="Rotate CUBIQ to choose a mode, then press START." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <CurrentActivityCard />
        <SectionCard title="Device">
          <DeviceVisual />
        </SectionCard>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Focus time" value={formatDuration(focusTotal)} icon={<Clock className="size-4" />} />
        <StatCard label="Focus sessions" value={String(focus.length)} icon={<Activity className="size-4" />} />
        <StatCard label="Meetings" value={String(meetings.length)} icon={<Mic className="size-4" />} />
        <StatCard label="Open tasks" value={String(open)} icon={<ListChecks className="size-4" />} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard title="This week">
          <ProductivityChart />
        </SectionCard>
        <SectionCard
          title="Recent activity"
          action={
            <Link to="/productivity" className="text-xs font-semibold text-primary">
              View all
            </Link>
          }
        >
          <ActivityTimeline sessions={sessions.slice(0, 6)} />
        </SectionCard>
      </div>
    </>
  );
}
