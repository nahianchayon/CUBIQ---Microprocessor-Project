import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, SectionCard, StatusBadge } from "@/components/cubiq/primitives";
import { TranscriptViewer } from "@/components/cubiq/transcript-viewer";
import { mockRecordings, mockTranscripts } from "@/lib/cubiq/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transcripts")({
  head: () => ({
    meta: [
      { title: "Transcripts — CUBIQ" },
      { name: "description", content: "Read speaker-labelled transcripts of your recorded meetings." },
      { property: "og:title", content: "Transcripts — CUBIQ" },
      { property: "og:description", content: "Read speaker-labelled transcripts of your recorded meetings." },
    ],
  }),
  component: TranscriptsPage,
});

function TranscriptsPage() {
  const [selectedId, setSelectedId] = useState(mockTranscripts[0]?.id);
  const selected = mockTranscripts.find((t) => t.id === selectedId);
  const titleOf = (recId: string) => mockRecordings.find((r) => r.id === recId)?.title ?? "Recording";
  return (
    <>
      <PageHeader title="Transcripts" description="Generated on the device after each meeting." />
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <SectionCard title="All transcripts">
          <ul className="flex flex-col gap-1">
            {mockTranscripts.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary",
                    t.id === selectedId && "bg-primary-soft text-accent-foreground",
                  )}
                >
                  <span className="block font-medium">{titleOf(t.recordingId)}</span>
                  <span className="text-xs text-muted-foreground">{t.createdAt}</span>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard
          title={selected ? titleOf(selected.recordingId) : "Transcript"}
          action={selected ? <StatusBadge health={selected.status === "ready" ? "ready" : "processing"} label={selected.language} /> : null}
        >
          {selected ? (
            <TranscriptViewer segments={selected.segments} />
          ) : (
            <EmptyState title="No transcripts yet" description="Record a meeting to generate one." />
          )}
        </SectionCard>
      </div>
    </>
  );
}
