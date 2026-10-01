import { cn } from "@/lib/utils";
import { modeLabel, orientationLabel, useDevice } from "@/lib/cubiq/device-store";

export function DeviceVisual({ compact = false }: { compact?: boolean }) {
  const { device, status } = useDevice();
  const faceLabel = device.mode === "idle" ? "IDLE" : modeLabel[device.mode].toUpperCase();
  const recording = status === "recording";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Real 3D CUBIQ Hardware Microprocessor Cube Photo */}
      <div className="relative group flex flex-col items-center justify-center">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border-2 bg-card p-1.5 shadow-xl transition-all duration-500",
            compact ? "max-w-[180px]" : "max-w-[280px]",
            device.orientation === "focus-up" && "-rotate-2 scale-102 border-primary shadow-primary/20",
            device.orientation === "meeting-up" && "rotate-2 scale-102 border-primary shadow-primary/20",
            device.orientation === "face-down" && "opacity-75 border-border",
            device.mode !== "idle" && "border-primary/50",
          )}
        >
          <img
            src="/cubiq-hardware-cube.jpg"
            alt="CUBIQ Hardware Microprocessor Cube"
            className="w-full h-auto object-cover rounded-xl shadow-inner"
          />

          {/* Live Recording / Status LED Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 backdrop-blur border border-border text-[0.6875rem] font-semibold">
            <span
              className={cn(
                "size-2 rounded-full",
                recording ? "bg-destructive animate-pulse" : device.connected ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40",
              )}
            />
            <span className="text-foreground font-mono">
              {recording ? "REC" : device.connected ? "LIVE" : "OFF"}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="label-caps">Current face</p>
        <p className="font-display text-lg font-bold tracking-[0.08em] text-primary">{faceLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Orientation detected · {orientationLabel[device.orientation]}
        </p>
      </div>
    </div>
  );
}
