import { Link } from "@tanstack/react-router";
import { CircleStop, Cpu, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cubiq/primitives";
import { FOCUS_LENGTH_SECONDS, useDevice } from "@/lib/cubiq/device-store";
import { formatClock, formatDuration } from "@/lib/cubiq/format";
import { cn } from "@/lib/utils";

export function CurrentActivityCard() {
  const { device, mode, status, elapsedSeconds, remainingSeconds, progress, startedAtLabel, pressStop, lastCompleted } =
    useDevice();

  const headline = mode === "idle" ? "IDLE" : mode === "focus" ? "FOCUS" : "MEETING";
  const bigValue =
    mode === "focus"
      ? formatClock(status === "ready" || status === "idle" ? FOCUS_LENGTH_SECONDS : remainingSeconds)
      : mode === "meeting"
        ? formatClock(status === "recording" ? elapsedSeconds : 0, true)
        : null;

  return (
    <section className="surface relative overflow-hidden p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="label-caps">Current activity</h2>
        <StatusBadge
          health={device.connected ? "online" : "offline"}
          label={device.connected ? "Device connected" : "Device offline"}
          pulse={device.connected}
        />
      </div>

      {mode === "idle" ? (
        <div className="mt-6">
          <p className="font-display text-3xl font-extrabold tracking-[0.1em] text-foreground">IDLE</p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">No active session.</p>
          <p className="mt-6 max-w-sm text-sm font-medium text-muted-foreground">
            Place CUBIQ on a mode face to begin. Rotate &rarr; Place &rarr; Press START &rarr; Work.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-xl font-bold backdrop-blur-md">
            <Link to="/device">
              <Cpu aria-hidden className="size-4" />
              View device
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="font-display text-2xl font-extrabold tracking-[0.12em] text-foreground">{headline}</p>
              {status === "recording" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-rose-500">
                  <span aria-hidden className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-rose-500" />
                  RECORDING
                </span>
              ) : (
                <StatusBadge
                  health={status === "running" ? "online" : status === "complete" ? "ready" : "processing"}
                  label={status === "running" ? "Running" : status === "complete" ? "Session complete" : "Ready"}
                />
              )}
            </div>

            <p className={cn("timer-numeral mt-4 text-6xl font-extrabold text-foreground sm:text-7xl")}>{bigValue}</p>

            {mode === "focus" ? (
              <div className="mt-5 max-w-sm">
                <div
                  className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/80 border border-border/40 p-0.5 backdrop-blur-md"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label="Focus session progress"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-1000 ease-linear shadow-xs"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <p className="mt-4 text-sm font-medium text-muted-foreground">
              {status === "ready"
                ? `CUBIQ is positioned in ${headline.toLowerCase()} mode. Press START on the device.`
                : status === "running"
                  ? `Started ${startedAtLabel}`
                  : status === "recording"
                    ? `Recording in progress · started ${startedAtLabel}`
                    : lastCompleted
                      ? `Duration ${formatDuration(lastCompleted.durationSeconds)} · added to productivity history`
                      : "Waiting for the device."}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            {status === "running" || status === "recording" ? (
              <Button onClick={pressStop} variant="destructive" className="rounded-xl font-bold">
                <CircleStop aria-hidden className="size-4" />
                {status === "recording" ? "Stop recording" : "Stop session"}
              </Button>
            ) : (
              <Button asChild variant="outline" className="rounded-xl font-bold backdrop-blur-md">
                <Link to={mode === "focus" ? "/focus" : "/meetings"}>
                  <Radio aria-hidden className="size-4" />
                  {mode === "focus" ? "Open focus" : "Open meetings"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
