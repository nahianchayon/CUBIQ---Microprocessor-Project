import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/cubiq/primitives";
import type { TranscriptSegment } from "@/lib/cubiq/types";

export function TranscriptViewer({ segments }: { segments: TranscriptSegment[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return segments;
    return segments.filter(
      (s) => s.text.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q),
    );
  }, [query, segments]);

  return (
    <div>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transcript..."
          aria-label="Search transcript"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No matches" description="No transcript lines contain that text. Try a different search." />
        </div>
      ) : (
        <ol className="mt-5 flex flex-col">
          {filtered.map((segment, index) => (
            <li
              key={`${segment.timestamp}-${index}`}
              className="flex gap-4 border-b border-border/70 py-4 last:border-0"
            >
              <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-accent-foreground">
                {segment.timestamp}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-muted-foreground">{segment.speaker}</span>
                <span className="mt-1 block text-sm leading-relaxed text-foreground">{segment.text}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
