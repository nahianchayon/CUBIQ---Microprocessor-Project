import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
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
  type Firestore,
} from "firebase/firestore";
import {
  getDatabase,
  ref as rtdbRef,
  onValue,
  set,
  push,
  update,
  type Database,
} from "firebase/database";

// Firebase Configuration for project cubiq-14fb1
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKn3WM52p-XK_AXKddH6oG7Vw88QqNWGM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cubiq-14fb1.firebaseapp.com",
  databaseURL: "https://cubiq-14fb1-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cubiq-14fb1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cubiq-14fb1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "690198114613",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:690198114613:web:19091c4d9fda9d69e5dc7c",
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let db: Firestore | null = null;
let rtdb: Database | null = null;

if (typeof window !== "undefined") {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
    firebaseAuth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    rtdb = getDatabase(firebaseApp, firebaseConfig.databaseURL);
  } catch (error) {
    console.warn("Firebase initialization notice:", error);
  }
}

export {
  firebaseApp,
  firebaseAuth,
  db,
  rtdb,
  rtdbRef,
  onValue,
  set,
  push,
  update,
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
};

