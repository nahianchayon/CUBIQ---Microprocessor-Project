import {
  fetchUserSessions,
  fetchUserRecordings,
  fetchUserTranscripts,
  fetchUserSummaries,
  fetchUserTasks,
  fetchUserProductivity,
} from "./firestore-service";
import { mockDevice } from "./mock-data";
import type { Device, ProductivityDay, Recording, Session, Summary, Task, Transcript } from "./types";

export const deviceService = {
  getStatus: (): Promise<Device> => Promise.resolve(mockDevice),
};

export const sessionService = {
  list: (userId = "demo-user"): Promise<Session[]> => fetchUserSessions(userId),
  start: (type: Session["type"]): Promise<{ accepted: boolean; type: Session["type"] }> =>
    Promise.resolve({ accepted: true, type }),
  stop: (): Promise<{ accepted: boolean }> => Promise.resolve({ accepted: true }),
};

export const recordingService = {
  list: (userId = "demo-user"): Promise<Recording[]> => fetchUserRecordings(userId),
  get: async (id: string, userId = "demo-user"): Promise<Recording | undefined> => {
    const list = await fetchUserRecordings(userId);
    return list.find((r) => r.id === id);
  },
};

export const transcriptService = {
  list: (userId = "demo-user"): Promise<Transcript[]> => fetchUserTranscripts(userId),
  get: async (id: string, userId = "demo-user"): Promise<Transcript | undefined> => {
    const list = await fetchUserTranscripts(userId);
    return list.find((t) => t.id === id);
  },
};

export const summaryService = {
  list: (userId = "demo-user"): Promise<Summary[]> => fetchUserSummaries(userId),
  getByRecording: async (recordingId: string, userId = "demo-user"): Promise<Summary | undefined> => {
    const list = await fetchUserSummaries(userId);
    return list.find((s) => s.recordingId === recordingId);
  },
};

export const productivityService = {
  list: (userId = "demo-user"): Promise<ProductivityDay[]> => fetchUserProductivity(userId),
};

export const aiService = {
  getTasks: (userId = "demo-user"): Promise<Task[]> => fetchUserTasks(userId),
};
