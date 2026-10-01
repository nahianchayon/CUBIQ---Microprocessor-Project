import { createFileRoute, Link } from "@tanstack/react-router";

import { AudioPlayer } from "@/components/cubiq/audio-player";
import { PageHeader, SectionCard, StatusBadge } from "@/components/cubiq/primitives";
import { ProtectedRoute } from "@/components/cubiq/protected-route";
import { formatDuration } from "@/lib/cubiq/format";
import { mockRecordings } from "@/lib/cubiq/mock-data";

export const Route = createFileRoute("/recordings")({
  head: () => ({
    meta: [
      { title: "Recordings — CUBIQ" },
      { name: "description", content: "Listen back to meetings captured by CUBIQ." },
      { property: "og:title", content: "Recordings — CUBIQ" },
      { property: "og:description", content: "Listen back to meetings captured by CUBIQ." },
    ],
  }),
  component: RecordingsPage,
});

function RecordingsPage() {
  return (
    <ProtectedRoute>
      <PageHeader title="Recordings" description="Every meeting CUBIQ has captured." />
      <div className="grid gap-4">
        {mockRecordings.map((r) => (
          <SectionCard key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">{r.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {r.date} · {r.startTime} · {formatDuration(r.durationSeconds)} · {r.taskCount} tasks
                </p>
              </div>
              <StatusBadge health={r.status === "ready" ? "ready" : r.status === "processing" ? "processing" : "offline"} label={r.status} />
            </div>
            <div className="mt-4">
              <AudioPlayer durationSeconds={r.durationSeconds} title={r.title} />
            </div>
            {r.transcriptId ? (
              <Link to="/transcripts" className="mt-3 inline-block text-sm font-semibold text-primary">
                View transcript →
              </Link>
            ) : null}
          </SectionCard>
        ))}
      </div>
    </ProtectedRoute>
  );
}
