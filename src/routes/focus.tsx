import { createFileRoute } from "@tanstack/react-router";

import { ActivityTimeline } from "@/components/cubiq/activity-timeline";
import { CurrentActivityCard } from "@/components/cubiq/current-activity";
import { PageHeader, SectionCard } from "@/components/cubiq/primitives";
import { ProtectedRoute } from "@/components/cubiq/protected-route";
import { useDevice } from "@/lib/cubiq/device-store";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus — CUBIQ" },
      { name: "description", content: "Run 25-minute focus sessions with your CUBIQ device." },
      { property: "og:title", content: "Focus — CUBIQ" },
      { property: "og:description", content: "Run 25-minute focus sessions with your CUBIQ device." },
    ],
  }),
  component: FocusPage,
});

function FocusPage() {
  const { sessions } = useDevice();
  return (
    <ProtectedRoute>
      <PageHeader title="Focus" description="Turn CUBIQ to the Focus face and press START for a 25-minute session." />
      <CurrentActivityCard />
      <SectionCard title="Focus history">
        <ActivityTimeline sessions={sessions.filter((s) => s.type === "focus")} />
      </SectionCard>
    </ProtectedRoute>
  );
}
