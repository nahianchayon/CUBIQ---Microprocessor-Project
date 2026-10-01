// Core CUBIQ domain types. These mirror the backend entities that the
// Raspberry Pi service will expose, so the UI can switch from mock data to
// real API responses without changing component code.

export type DeviceMode = "idle" | "focus" | "meeting";
export type Orientation = "face-down" | "focus-up" | "meeting-up";
export type ActivityStatus = "idle" | "ready" | "running" | "recording" | "complete";
export type ComponentHealth = "online" | "ready" | "processing" | "offline" | "inactive";

export interface Device {
  id: string;
  name: string;
  connected: boolean;
  orientation: Orientation;
  mode: DeviceMode;
  battery: number;
  wifiStatus: ComponentHealth;
  espStatus: ComponentHealth;
  raspberryPiStatus: ComponentHealth;
  microphoneStatus: ComponentHealth;
  mpuStatus: ComponentHealth;
  lastSeen: string;
}

export interface Session {
  id: string;
  type: "focus" | "meeting";
  title: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  status: "completed" | "stopped";
  deviceId: string;
}

export interface TranscriptSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface Transcript {
  id: string;
  recordingId: string;
  language: string;
  status: "ready" | "processing" | "failed";
  createdAt: string;
  segments: TranscriptSegment[];
}

export interface Summary {
  id: string;
  recordingId: string;
  summary: string;
  keyPoints: string[];
  topics: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  sourceRecordingId: string;
  title: string;
  priority: "low" | "medium" | "high";
  status: "open" | "done";
  createdAt: string;
}

export interface Recording {
  id: string;
  title: string;
  date: string;
  startTime: string;
  durationSeconds: number;
  audioUrl: string | null;
  status: "ready" | "processing" | "failed";
  transcriptId: string | null;
  summaryId: string | null;
  taskCount: number;
}

export interface ProductivityDay {
  date: string;
  label: string;
  focusMinutes: number;
  meetingMinutes: number;
  recordings: number;
  meetings: number;
  completedSessions: number;
}
