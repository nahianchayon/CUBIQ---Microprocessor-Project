import { Link } from "@tanstack/react-router";
import { Mic, Timer } from "lucide-react";

import { formatDuration } from "@/lib/cubiq/format";
import type { Session } from "@/lib/cubiq/types";

export function ActivityTimeline({ sessions }: { sessions: Session[] }) {
  return (
    <ul className="flex flex-col">
      {sessions.map((session) => (
        <li key={session.id} className="border-b border-border/70 last:border-0">
          <Link
            to={session.type === "meeting" ? "/meetings" : "/focus"}
            className="flex items-center gap-4 rounded-lg px-1 py-3.5 transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span
              aria-hidden
              className={
                session.type === "focus"
                  ? "grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground"
                  : "grid size-9 shrink-0 place-items-center rounded-lg bg-success-soft text-success"
              }
            >
              {session.type === "focus" ? <Timer className="size-4" /> : <Mic className="size-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-foreground">{session.title}</span>
              <span className="block text-xs text-muted-foreground">{session.startTime}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
              {formatDuration(session.durationSeconds)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
