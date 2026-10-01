import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
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

// Centralized Firebase Configuration for cubiq-b6979
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForCubiqProjectB6979",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cubiq-b6979.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://cubiq-b6979-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cubiq-b6979",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cubiq-b6979.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "409298511406",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:409298511406:web:cubiqb6979",
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.projectId);
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
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
};
