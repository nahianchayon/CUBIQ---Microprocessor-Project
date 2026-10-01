// Realistic mock data used until the Raspberry Pi backend is connected.
// TODO(api): replace each export with the matching service call in
// src/lib/cubiq/services.ts (GET /api/sessions, /api/recordings, ...).

import type {
  Device,
  ProductivityDay,
  Recording,
  Session,
  Summary,
  Task,
  Transcript,
} from "./types";

export const mockDevice: Device = {
  id: "cubiq-01",
  name: "CUBIQ-01",
  connected: true,
  orientation: "face-down",
  mode: "idle",
  battery: 82,
  wifiStatus: "online",
  espStatus: "online",
  raspberryPiStatus: "online",
  microphoneStatus: "ready",
  mpuStatus: "ready",
  lastSeen: "Just now",
};

export const mockSessions: Session[] = [
  {
    id: "s-1",
    type: "focus",
    title: "Focus Session",
    startTime: "Today · 06:14 PM",
    endTime: "Today · 06:39 PM",
    durationSeconds: 1500,
    status: "completed",
    deviceId: "cubiq-01",
  },
  {
    id: "s-2",
    type: "meeting",
    title: "Meeting Recording",
    startTime: "Today · 03:42 PM",
    endTime: "Today · 04:24 PM",
    durationSeconds: 2520,
    status: "completed",
    deviceId: "cubiq-01",
  },
  {
    id: "s-3",
    type: "focus",
    title: "Focus Session",
    startTime: "Yesterday · 11:20 AM",
    endTime: "Yesterday · 12:10 PM",
    durationSeconds: 3000,
    status: "completed",
    deviceId: "cubiq-01",
  },
  {
    id: "s-4",
    type: "meeting",
    title: "Meeting Recording",
    startTime: "Yesterday · 09:10 AM",
    endTime: "Yesterday · 09:28 AM",
    durationSeconds: 1080,
    status: "completed",
    deviceId: "cubiq-01",
  },
  {
    id: "s-5",
    type: "focus",
    title: "Focus Session",
    startTime: "Sep 28 · 04:05 PM",
    endTime: "Sep 28 · 04:30 PM",
    durationSeconds: 1500,
    status: "stopped",
    deviceId: "cubiq-01",
  },
];

export const mockTranscripts: Transcript[] = [
  {
    id: "t-1",
    recordingId: "r-1",
    language: "English",
    status: "ready",
    createdAt: "Sep 30, 2026",
    segments: [
      {
        timestamp: "00:02",
        speaker: "Speaker 1",
        text: "We discussed the dataset we collected last week and how much of it still needs cleaning before training.",
      },
      {
        timestamp: "00:18",
        speaker: "Speaker 2",
        text: "The preprocessing pipeline is mostly written, but the normalisation step still needs to handle missing scans.",
      },
      {
        timestamp: "00:42",
        speaker: "Speaker 1",
        text: "Next we need to lock the model architecture so the backend team can plan the inference endpoint.",
      },
      {
        timestamp: "01:15",
        speaker: "Speaker 3",
        text: "I can take the transcription test on the Raspberry Pi and report the latency numbers by Thursday.",
      },
      {
        timestamp: "02:04",
        speaker: "Speaker 2",
        text: "Then the dashboard integration is the last piece. Once the API returns transcripts we can wire the viewer.",
      },
    ],
  },
  {
    id: "t-2",
    recordingId: "r-2",
    language: "English",
    status: "ready",
    createdAt: "Sep 29, 2026",
    segments: [
      {
        timestamp: "00:00",
        speaker: "Speaker 1",
        text: "Welcome everyone. Today we review the research direction for cancer detection accuracy.",
      },
      {
        timestamp: "00:12",
        speaker: "Speaker 2",
        text: "Today we will discuss the evaluation metrics and which baseline we compare against.",
      },
      {
        timestamp: "00:38",
        speaker: "Speaker 1",
        text: "The main focus is recall. A false negative is far more costly than a false positive here.",
      },
      {
        timestamp: "01:26",
        speaker: "Speaker 3",
        text: "I will prepare the documentation of the current results so the supervisor can review it.",
      },
    ],
  },
  {
    id: "t-3",
    recordingId: "r-3",
    language: "English",
    status: "processing",
    createdAt: "Sep 28, 2026",
    segments: [],
  },
];

export const mockSummaries: Summary[] = [
  {
    id: "sum-1",
    recordingId: "r-1",
    summary:
      "The meeting discussed the project architecture, dataset preparation, and the upcoming implementation tasks. The team agreed to finalise preprocessing before locking the model architecture, and to validate transcription latency on the Raspberry Pi.",
    keyPoints: [
      "Dataset preprocessing needs to handle missing scans",
      "Model architecture must be locked this week",
      "Backend integration depends on the transcript API",
      "Testing timeline targets Thursday for latency numbers",
    ],
    topics: ["Machine Learning", "Dataset", "Model Training", "Backend"],
    createdAt: "Sep 30, 2026",
  },
  {
    id: "sum-2",
    recordingId: "r-2",
    summary:
      "A research discussion focused on evaluation metrics for cancer detection, with recall prioritised over precision. Documentation of current results will be prepared for supervisor review.",
    keyPoints: [
      "Recall is the primary metric",
      "Baseline comparison to be selected",
      "Results documentation for supervisor review",
    ],
    topics: ["Cancer Detection", "Evaluation", "Research"],
    createdAt: "Sep 29, 2026",
  },
];

export const mockRecordings: Recording[] = [
  {
    id: "r-1",
    title: "Project Discussion",
    date: "Sep 30, 2026",
    startTime: "03:42 PM",
    durationSeconds: 2538,
    audioUrl: null,
    status: "ready",
    transcriptId: "t-1",
    summaryId: "sum-1",
    taskCount: 4,
  },
  {
    id: "r-2",
    title: "Research Discussion",
    date: "Sep 29, 2026",
    startTime: "09:10 AM",
    durationSeconds: 1112,
    audioUrl: null,
    status: "ready",
    transcriptId: "t-2",
    summaryId: "sum-2",
    taskCount: 3,
  },
  {
    id: "r-3",
    title: "Supervisor Check-in",
    date: "Sep 28, 2026",
    startTime: "01:05 PM",
    durationSeconds: 942,
    audioUrl: null,
    status: "processing",
    transcriptId: "t-3",
    summaryId: null,
    taskCount: 0,
  },
  {
    id: "r-4",
    title: "Hardware Planning",
    date: "Sep 26, 2026",
    startTime: "10:30 AM",
    durationSeconds: 1875,
    audioUrl: null,
    status: "failed",
    transcriptId: null,
    summaryId: null,
    taskCount: 0,
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    sourceRecordingId: "r-1",
    title: "Prepare dataset",
    priority: "high",
    status: "open",
    createdAt: "Sep 30, 2026",
  },
  {
    id: "task-2",
    sourceRecordingId: "r-1",
    title: "Complete preprocessing pipeline",
    priority: "high",
    status: "open",
    createdAt: "Sep 30, 2026",
  },
  {
    id: "task-3",
    sourceRecordingId: "r-1",
    title: "Test transcription on Raspberry Pi",
    priority: "medium",
    status: "open",
    createdAt: "Sep 30, 2026",
  },
  {
    id: "task-4",
    sourceRecordingId: "r-1",
    title: "Integrate dashboard API",
    priority: "medium",
    status: "done",
    createdAt: "Sep 30, 2026",
  },
  {
    id: "task-5",
    sourceRecordingId: "r-2",
    title: "Review dataset labels",
    priority: "medium",
    status: "open",
    createdAt: "Sep 29, 2026",
  },
  {
    id: "task-6",
    sourceRecordingId: "r-2",
    title: "Select evaluation baseline",
    priority: "low",
    status: "open",
    createdAt: "Sep 29, 2026",
  },
  {
    id: "task-7",
    sourceRecordingId: "r-2",
    title: "Prepare results documentation",
    priority: "high",
    status: "open",
    createdAt: "Sep 29, 2026",
  },
  {
    id: "task-8",
    sourceRecordingId: "r-1",
    title: "Document model architecture decision",
    priority: "low",
    status: "open",
    createdAt: "Sep 30, 2026",
  },
];

export const mockProductivity: ProductivityDay[] = [
  { date: "2026-09-24", label: "Sep 24", focusMinutes: 145, meetingMinutes: 40, recordings: 1, meetings: 1, completedSessions: 4 },
  { date: "2026-09-25", label: "Sep 25", focusMinutes: 210, meetingMinutes: 65, recordings: 2, meetings: 2, completedSessions: 6 },
  { date: "2026-09-26", label: "Sep 26", focusMinutes: 95, meetingMinutes: 31, recordings: 1, meetings: 1, completedSessions: 3 },
  { date: "2026-09-27", label: "Sep 27", focusMinutes: 60, meetingMinutes: 0, recordings: 0, meetings: 0, completedSessions: 2 },
  { date: "2026-09-28", label: "Sep 28", focusMinutes: 175, meetingMinutes: 16, recordings: 1, meetings: 1, completedSessions: 5 },
  { date: "2026-09-29", label: "Sep 29", focusMinutes: 185, meetingMinutes: 19, recordings: 1, meetings: 1, completedSessions: 5 },
  { date: "2026-09-30", label: "Sep 30", focusMinutes: 135, meetingMinutes: 42, recordings: 2, meetings: 3, completedSessions: 4 },
];

export const mockMeetingTitles = ["Project Discussion", "Research Discussion", "Supervisor Check-in", "Hardware Planning"];
