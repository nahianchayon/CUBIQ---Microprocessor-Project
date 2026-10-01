// Thin service layer. Today every function resolves mock data; each one maps
// 1:1 to a backend endpoint so swapping in the real Raspberry Pi API is a
// single-file change.
//
// TODO(api): GET  /api/device/status      -> deviceService.getStatus
// TODO(api): POST /api/session/start      -> sessionService.start
// TODO(api): POST /api/session/stop       -> sessionService.stop
// TODO(api): GET  /api/sessions           -> sessionService.list
// TODO(api): GET  /api/recordings         -> recordingService.list
// TODO(api): GET  /api/transcripts        -> transcriptService.list
// TODO(api): GET  /api/productivity       -> productivityService.list
// TODO(api): GET  /api/ai/insights        -> aiService.getInsights

import {
  mockDevice,
  mockProductivity,
  mockRecordings,
  mockSessions,
  mockSummaries,
  mockTasks,
  mockTranscripts,
} from "./mock-data";
import type { Device, ProductivityDay, Recording, Session, Summary, Task, Transcript } from "./types";

const latency = <T>(value: T, ms = 240): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const deviceService = {
  getStatus: (): Promise<Device> => latency(mockDevice),
};

export const sessionService = {
  list: (): Promise<Session[]> => latency(mockSessions),
  start: (type: Session["type"]): Promise<{ accepted: boolean; type: Session["type"] }> =>
    latency({ accepted: true, type }, 120),
  stop: (): Promise<{ accepted: boolean }> => latency({ accepted: true }, 120),
};

export const recordingService = {
  list: (): Promise<Recording[]> => latency(mockRecordings),
  get: (id: string): Promise<Recording | undefined> =>
    latency(mockRecordings.find((r) => r.id === id)),
};

export const transcriptService = {
  list: (): Promise<Transcript[]> => latency(mockTranscripts),
  get: (id: string): Promise<Transcript | undefined> =>
    latency(mockTranscripts.find((t) => t.id === id)),
};

export const summaryService = {
  list: (): Promise<Summary[]> => latency(mockSummaries),
  getByRecording: (recordingId: string): Promise<Summary | undefined> =>
    latency(mockSummaries.find((s) => s.recordingId === recordingId)),
};

export const productivityService = {
  list: (): Promise<ProductivityDay[]> => latency(mockProductivity),
};

export const aiService = {
  getTasks: (): Promise<Task[]> => latency(mockTasks),
};
