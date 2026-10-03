import {
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "../firebase";
import {
  mockProductivity,
  mockRecordings,
  mockSessions,
  mockSummaries,
  mockTasks,
  mockTranscripts,
} from "./mock-data";
import type {
  ProductivityDay,
  Recording,
  Session,
  Summary,
  Task,
  Transcript,
} from "./types";
import type { UserProfile } from "./auth-context";

// -------------------------------------------------------------
// USER PROFILES (users/{uid})
// -------------------------------------------------------------
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!db) return;
  try {
    const userRef = doc(db, "users", profile.uid);
    await setDoc(
      userRef,
      {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        photoURL: profile.photoURL || null,
        bio: profile.bio || null,
        role: profile.role || "Operator",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (err) {
    console.warn("Firestore user sync notice:", err);
  }
}

export async function fetchUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: data.uid || uid,
        email: data.email || "",
        displayName: data.displayName || "CUBIQ Member",
        photoURL: data.photoURL || undefined,
        bio: data.bio || undefined,
        role: data.role || "Operator",
        isDummy: false,
      };
    }
  } catch (err) {
    console.warn("Firestore fetch user notice:", err);
  }
  return null;
}

// -------------------------------------------------------------
// SESSIONS (sessions collection)
// -------------------------------------------------------------
export async function fetchUserSessions(userId: string): Promise<Session[]> {
  if (!db) return mockSessions;
  try {
    const sQuery = query(collection(db, "sessions"), where("userId", "==", userId));
    const snap = await getDocs(sQuery);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Session, "id">) }));
    } else {
      // Seed default user sessions to Firestore so data persists
      await seedDefaultSessions(userId);
      return mockSessions.map((s) => ({ ...s, userId }));
    }
  } catch (err) {
    console.warn("Firestore fetch sessions notice:", err);
    return mockSessions;
  }
}

export async function createFirestoreSession(session: Session, userId: string): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, "sessions"), {
      ...session,
      userId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore create session notice:", err);
  }
}

async function seedDefaultSessions(userId: string): Promise<void> {
  if (!db) return;
  try {
    for (const session of mockSessions) {
      await addDoc(collection(db, "sessions"), {
        ...session,
        userId,
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("Seed sessions notice:", e);
  }
}

// -------------------------------------------------------------
// RECORDINGS (recordings collection)
// -------------------------------------------------------------
export async function fetchUserRecordings(userId: string): Promise<Recording[]> {
  if (!db) return mockRecordings;
  try {
    const rQuery = query(collection(db, "recordings"), where("userId", "==", userId));
    const snap = await getDocs(rQuery);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Recording, "id">) }));
    } else {
      await seedDefaultRecordings(userId);
      return mockRecordings;
    }
  } catch (err) {
    console.warn("Firestore fetch recordings notice:", err);
    return mockRecordings;
  }
}

async function seedDefaultRecordings(userId: string): Promise<void> {
  if (!db) return;
  try {
    for (const rec of mockRecordings) {
      await addDoc(collection(db, "recordings"), {
        ...rec,
        userId,
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("Seed recordings notice:", e);
  }
}

// -------------------------------------------------------------
// TRANSCRIPTS (transcripts collection)
// -------------------------------------------------------------
export async function fetchUserTranscripts(userId: string): Promise<Transcript[]> {
  if (!db) return mockTranscripts;
  try {
    const tQuery = query(collection(db, "transcripts"), where("userId", "==", userId));
    const snap = await getDocs(tQuery);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transcript, "id">) }));
    } else {
      await seedDefaultTranscripts(userId);
      return mockTranscripts;
    }
  } catch (err) {
    console.warn("Firestore fetch transcripts notice:", err);
    return mockTranscripts;
  }
}

async function seedDefaultTranscripts(userId: string): Promise<void> {
  if (!db) return;
  try {
    for (const item of mockTranscripts) {
      await addDoc(collection(db, "transcripts"), {
        ...item,
        userId,
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("Seed transcripts notice:", e);
  }
}

// -------------------------------------------------------------
// SUMMARIES (summaries collection)
// -------------------------------------------------------------
export async function fetchUserSummaries(userId: string): Promise<Summary[]> {
  if (!db) return mockSummaries;
  try {
    const sumQuery = query(collection(db, "summaries"), where("userId", "==", userId));
    const snap = await getDocs(sumQuery);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Summary, "id">) }));
    } else {
      await seedDefaultSummaries(userId);
      return mockSummaries;
    }
  } catch (err) {
    console.warn("Firestore fetch summaries notice:", err);
    return mockSummaries;
  }
}

async function seedDefaultSummaries(userId: string): Promise<void> {
  if (!db) return;
  try {
    for (const item of mockSummaries) {
      await addDoc(collection(db, "summaries"), {
        ...item,
        userId,
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("Seed summaries notice:", e);
  }
}

// -------------------------------------------------------------
// TASKS (tasks collection)
// -------------------------------------------------------------
export async function fetchUserTasks(userId: string): Promise<Task[]> {
  if (!db) return mockTasks;
  try {
    const taskQuery = query(collection(db, "tasks"), where("userId", "==", userId));
    const snap = await getDocs(taskQuery);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }));
    } else {
      await seedDefaultTasks(userId);
      return mockTasks;
    }
  } catch (err) {
    console.warn("Firestore fetch tasks notice:", err);
    return mockTasks;
  }
}

export async function updateFirestoreTaskStatus(docId: string, status: "open" | "done"): Promise<void> {
  if (!db) return;
  try {
    const tRef = doc(db, "tasks", docId);
    await updateDoc(tRef, { status, updatedAt: serverTimestamp() });
  } catch (err) {
    console.warn("Firestore update task notice:", err);
  }
}

export async function createFirestoreTask(task: Task, userId: string): Promise<void> {
  if (!db) return;
  try {
    await addDoc(collection(db, "tasks"), {
      ...task,
      userId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore create task notice:", err);
  }
}

async function seedDefaultTasks(userId: string): Promise<void> {
  if (!db) return;
  try {
    for (const task of mockTasks) {
      await addDoc(collection(db, "tasks"), {
        ...task,
        userId,
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("Seed tasks notice:", e);
  }
}

// -------------------------------------------------------------
// PRODUCTIVITY (productivity collection)
// -------------------------------------------------------------
export async function fetchUserProductivity(userId: string): Promise<ProductivityDay[]> {
  if (!db) return mockProductivity;
  try {
    const prodQuery = query(collection(db, "productivity"), where("userId", "==", userId));
    const snap = await getDocs(prodQuery);
    if (!snap.empty) {
      return snap.docs.map((d) => (d.data() as ProductivityDay));
    } else {
      await seedDefaultProductivity(userId);
      return mockProductivity;
    }
  } catch (err) {
    console.warn("Firestore fetch productivity notice:", err);
    return mockProductivity;
  }
}

async function seedDefaultProductivity(userId: string): Promise<void> {
  if (!db) return;
  try {
    for (const p of mockProductivity) {
      await addDoc(collection(db, "productivity"), {
        ...p,
        userId,
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    console.warn("Seed productivity notice:", e);
  }
}
