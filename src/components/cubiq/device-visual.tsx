import { cn } from "@/lib/utils";
import { modeLabel, orientationLabel, useDevice } from "@/lib/cubiq/device-store";

export function DeviceVisual({ compact = false }: { compact?: boolean }) {
  const { device, status } = useDevice();
  const faceLabel = device.mode === "idle" ? "IDLE" : modeLabel[device.mode].toUpperCase();
  const recording = status === "recording";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        aria-hidden
        className={cn(
          "relative grid place-items-center rounded-[1.4rem] border border-border bg-gradient-to-br from-secondary to-card transition-transform duration-500",
          compact ? "h-28 w-28" : "h-40 w-40",
          device.orientation === "focus-up" && "-rotate-3",
          device.orientation === "meeting-up" && "rotate-3",
          device.orientation === "face-down" && "opacity-70",
        )}
        style={{ boxShadow: "var(--shadow-raised)" }}
      >
        <span
          className={cn(
            "absolute inset-3 rounded-[1rem] border transition-colors",
            device.mode === "idle" ? "border-border" : "border-primary/40",
          )}
        />
        <span className={cn("font-display font-extrabold tracking-[0.18em] text-foreground", compact ? "text-xs" : "text-sm")}>
          CUBIQ
        </span>
        <span
          className={cn(
            "absolute bottom-5 h-2.5 w-2.5 rounded-full",
            recording ? "bg-destructive animate-pulse-dot" : device.connected ? "bg-success" : "bg-muted-foreground/40",
          )}
        />
      </div>
      <div className="text-center">
        <p className="label-caps">Current face</p>
        <p className="font-display text-lg font-bold tracking-[0.08em] text-foreground">{faceLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Orientation detected · {orientationLabel[device.orientation]}
        </p>
      </div>
    </div>
  );
}
