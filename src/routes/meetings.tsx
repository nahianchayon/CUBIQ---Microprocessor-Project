import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { ActivityTimeline } from "@/components/cubiq/activity-timeline";
import { CurrentActivityCard } from "@/components/cubiq/current-activity";
import { PageHeader, SectionCard } from "@/components/cubiq/primitives";
import { ProtectedRoute } from "@/components/cubiq/protected-route";
import { useDevice, type PipelineStage } from "@/lib/cubiq/device-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meetings — CUBIQ" },
      { name: "description", content: "Record meetings and get transcripts, summaries and tasks automatically." },
      { property: "og:title", content: "Meetings — CUBIQ" },
      { property: "og:description", content: "Record meetings and get transcripts, summaries and tasks automatically." },
    ],
  }),
  component: MeetingsPage,
});

const stages: { id: PipelineStage; label: string }[] = [
  { id: "recording", label: "Recording" },
  { id: "transcribing", label: "Transcribing" },
  { id: "analyzing", label: "AI summary" },
  { id: "tasks", label: "Generating tasks" },
  { id: "complete", label: "Complete" },
];

function MeetingsPage() {
  const { sessions, pipeline } = useDevice();
  const current = stages.findIndex((s) => s.id === pipeline);

  return (
    <ProtectedRoute>
      <PageHeader title="Meetings" description="Turn CUBIQ to the Meeting face and press START to record." />
      <CurrentActivityCard />
      <SectionCard title="Processing pipeline">
        <ol className="grid gap-3 sm:grid-cols-5">
          {stages.map((s, i) => {
            const done = current > i || pipeline === "complete";
            const active = current === i && pipeline !== "complete";
            return (
              <li
                key={s.id}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-border p-3 text-sm",
                  done && "bg-success-soft text-success",
                  active && "bg-primary-soft text-accent-foreground",
                  !done && !active && "text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : <span className="label-caps">{i + 1}</span>}
                {s.label}
              </li>
            );
          })}
        </ol>
      </SectionCard>
      <SectionCard title="Meeting history">
        <ActivityTimeline sessions={sessions.filter((s) => s.type === "meeting")} />
      </SectionCard>
    </ProtectedRoute>
  );
}
