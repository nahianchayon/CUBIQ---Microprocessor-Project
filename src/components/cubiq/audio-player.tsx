import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

import { formatClock } from "@/lib/cubiq/format";

// Visual audio player. Once recordings expose a real audioUrl from the
// backend, swap the simulated position for an <audio> element's currentTime.
export function AudioPlayer({ durationSeconds, title }: { durationSeconds: number; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const barRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= durationSeconds) {
          setPlaying(false);
          return durationSeconds;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [durationSeconds, playing]);

  const progress = durationSeconds ? (position / durationSeconds) * 100 : 0;

  return (
    <div className="surface flex items-center gap-4 p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {formatClock(position)} / {formatClock(durationSeconds)}
          </p>
        </div>
        <button
          ref={barRef}
          type="button"
          aria-label="Seek recording"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const ratio = (event.clientX - rect.left) / rect.width;
            setPosition(Math.round(Math.min(1, Math.max(0, ratio)) * durationSeconds));
          }}
          className="mt-3 block h-2 w-full overflow-hidden rounded-full bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="block h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </button>
      </div>
      <Volume2 aria-hidden className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
    </div>
  );
}
