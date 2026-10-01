"use client";

// Single source of truth for what the physical CUBIQ is doing.
//
// In production this state is fed by real-time device events
// (DEVICE_CONNECTED, ORIENTATION_CHANGED, SESSION_STARTED, RECORDING_STOPPED,
// TRANSCRIPTION_COMPLETED, ...) arriving over a WebSocket from the backend.
// TODO(api): replace `applyEvent` callers with a WebSocket subscription; the
// reducer below already accepts the exact event shapes the firmware emits.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { mockDevice, mockSessions } from "./mock-data";
import { formatDuration } from "./format";
import type { ActivityStatus, Device, DeviceMode, Orientation, Session } from "./types";

export const FOCUS_LENGTH_SECONDS = 25 * 60;

export type PipelineStage = "idle" | "recording" | "transcribing" | "analyzing" | "tasks" | "complete";

export interface DeviceEvent {
  id: string;
  type:
    | "DEVICE_CONNECTED"
    | "DEVICE_DISCONNECTED"
    | "ORIENTATION_CHANGED"
    | "MODE_CHANGED"
    | "SESSION_STARTED"
    | "SESSION_STOPPED"
    | "RECORDING_STARTED"
    | "RECORDING_STOPPED"
    | "TRANSCRIPTION_STARTED"
    | "TRANSCRIPTION_COMPLETED"
    | "AI_PROCESSING_STARTED"
    | "AI_PROCESSING_COMPLETED";
  detail: string;
  at: string;
}

interface DeviceStoreValue {
  device: Device;
  mode: DeviceMode;
  status: ActivityStatus;
  elapsedSeconds: number;
  remainingSeconds: number;
  progress: number;
  startedAtLabel: string | null;
  pipeline: PipelineStage;
  sessions: Session[];
  events: DeviceEvent[];
  lastCompleted: { type: DeviceMode; durationSeconds: number } | null;
  setOrientation: (orientation: Orientation) => void;
  pressStart: () => void;
  pressStop: () => void;
  setConnected: (connected: boolean) => void;
  dismissCompleted: () => void;
}

const DeviceStoreContext = createContext<DeviceStoreValue | null>(null);

const orientationToMode: Record<Orientation, DeviceMode> = {
  "face-down": "idle",
  "focus-up": "focus",
  "meeting-up": "meeting",
};

export const orientationLabel: Record<Orientation, string> = {
  "face-down": "Face Down",
  "focus-up": "Focus Face Up",
  "meeting-up": "Meeting Face Up",
};

export const modeLabel: Record<DeviceMode, string> = {
  idle: "Idle",
  focus: "Focus",
  meeting: "Meeting",
};

function timeLabel(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function DeviceStoreProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<Device>(mockDevice);
  const [status, setStatus] = useState<ActivityStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startedAtLabel, setStartedAtLabel] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStage>("idle");
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [lastCompleted, setLastCompleted] = useState<DeviceStoreValue["lastCompleted"]>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pushEvent = useCallback((type: DeviceEvent["type"], detail: string) => {
    setEvents((prev) =>
      [
        { id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, detail, at: timeLabel(new Date()) },
        ...prev,
      ].slice(0, 20),
    );
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Session / recording tick. The physical device owns the clock; this mirrors it.
  useEffect(() => {
    if (status !== "running" && status !== "recording") return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const mode = device.mode;

  const setOrientation = useCallback(
    (orientation: Orientation) => {
      const nextMode = orientationToMode[orientation];
      setDevice((prev) => ({ ...prev, orientation, mode: nextMode, connected: true }));
      pushEvent("ORIENTATION_CHANGED", orientationLabel[orientation]);
      pushEvent("MODE_CHANGED", modeLabel[nextMode]);
      setElapsedSeconds(0);
      setStartedAtLabel(null);
      setStatus(nextMode === "idle" ? "idle" : "ready");
    },
    [pushEvent],
  );

  const pressStart = useCallback(() => {
    if (mode === "idle") {
      toast.warning("Place CUBIQ on a mode face first");
      return;
    }
    if (status === "running" || status === "recording") return;
    setElapsedSeconds(0);
    setStartedAtLabel(timeLabel(new Date()));
    setLastCompleted(null);
    if (mode === "focus") {
      setStatus("running");
      setPipeline("idle");
      pushEvent("SESSION_STARTED", "Focus session");
      toast.success("Focus session started");
    } else {
      setStatus("recording");
      setPipeline("recording");
      pushEvent("RECORDING_STARTED", "Meeting recording");
      toast.success("Meeting recording started");
    }
  }, [mode, pushEvent, status]);

  const pressStop = useCallback(() => {
    if (status !== "running" && status !== "recording") return;
    const duration = elapsedSeconds;
    const now = new Date();
    const wasRecording = status === "recording";
    setStatus("complete");
    setLastCompleted({ type: wasRecording ? "meeting" : "focus", durationSeconds: duration });
    setSessions((prev) => [
      {
        id: `s-live-${Date.now()}`,
        type: wasRecording ? "meeting" : "focus",
        title: wasRecording ? "Meeting Recording" : "Focus Session",
        startTime: `Today · ${startedAtLabel ?? timeLabel(now)}`,
        endTime: `Today · ${timeLabel(now)}`,
        durationSeconds: duration,
        status: "completed",
        deviceId: device.id,
      },
      ...prev,
    ]);

    if (wasRecording) {
      pushEvent("RECORDING_STOPPED", `Saved ${formatDuration(duration)}`);
      toast.success("Meeting recording saved");
      setPipeline("transcribing");
      pushEvent("TRANSCRIPTION_STARTED", "Raspberry Pi speech processing");
      timers.current.push(
        setTimeout(() => {
          setPipeline("analyzing");
          pushEvent("TRANSCRIPTION_COMPLETED", "English transcript ready");
          toast.success("Transcript generated");
          pushEvent("AI_PROCESSING_STARTED", "Analyzing transcript");
        }, 2600),
        setTimeout(() => {
          setPipeline("tasks");
          toast.success("AI summary ready");
        }, 5200),
        setTimeout(() => {
          setPipeline("complete");
          pushEvent("AI_PROCESSING_COMPLETED", "Tasks generated");
          toast.success("Tasks generated");
        }, 7200),
      );
    } else {
      pushEvent("SESSION_STOPPED", `Focus session · ${formatDuration(duration)}`);
      toast.success("Focus session complete");
    }
  }, [device.id, elapsedSeconds, pushEvent, startedAtLabel, status]);

  const setConnected = useCallback(
    (connected: boolean) => {
      setDevice((prev) => ({
        ...prev,
        connected,
        lastSeen: connected ? "Just now" : "2 minutes ago",
        wifiStatus: connected ? "online" : "offline",
        espStatus: connected ? "online" : "offline",
        raspberryPiStatus: connected ? "online" : "offline",
        microphoneStatus: connected ? "ready" : "inactive",
        mpuStatus: connected ? "ready" : "inactive",
      }));
      if (connected) {
        pushEvent("DEVICE_CONNECTED", "CUBIQ-01 online");
        toast.success("CUBIQ connected");
      } else {
        clearTimers();
        setStatus("idle");
        setElapsedSeconds(0);
        setPipeline("idle");
        pushEvent("DEVICE_DISCONNECTED", "CUBIQ-01 offline");
        toast.warning("CUBIQ disconnected");
      }
    },
    [clearTimers, pushEvent],
  );

  const remainingSeconds = mode === "focus" ? Math.max(0, FOCUS_LENGTH_SECONDS - elapsedSeconds) : 0;
  const progress =
    mode === "focus" ? Math.min(100, (elapsedSeconds / FOCUS_LENGTH_SECONDS) * 100) : 0;

  const value = useMemo<DeviceStoreValue>(
    () => ({
      device,
      mode,
      status,
      elapsedSeconds,
      remainingSeconds,
      progress,
      startedAtLabel,
      pipeline,
      sessions,
      events,
      lastCompleted,
      setOrientation,
      pressStart,
      pressStop,
      setConnected,
      dismissCompleted: () => setLastCompleted(null),
    }),
    [
      device,
      elapsedSeconds,
      events,
      lastCompleted,
      mode,
      pipeline,
      pressStart,
      pressStop,
      progress,
      remainingSeconds,
      sessions,
      setConnected,
      setOrientation,
      startedAtLabel,
      status,
    ],
  );

  return <DeviceStoreContext.Provider value={value}>{children}</DeviceStoreContext.Provider>;
}

export function useDevice() {
  const ctx = useContext(DeviceStoreContext);
  if (!ctx) throw new Error("useDevice must be used inside DeviceStoreProvider");
  return ctx;
}
