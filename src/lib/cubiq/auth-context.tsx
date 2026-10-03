import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { toast } from "sonner";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isDummy?: boolean;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string, isDummyMode?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, isDummyMode?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DUMMY_STORAGE_KEY = "cubiq_user_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isFirebaseActive = isFirebaseConfigured() && firebaseAuth !== null;

  useEffect(() => {
    if (isFirebaseActive && firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (fbUser) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || "user@cubiq.com",
            displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "CUBIQ Member",
            photoURL: fbUser.photoURL || undefined,
            isDummy: false,
          });
        } else {
          // Fall back to stored dummy session if any
          const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Offline / Dummy Auth Mode
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // Default initial demo user for frictionless testing
          const defaultDemo: UserProfile = {
            uid: "demo-user-101",
            email: "demo@cubiq.com",
            displayName: "Demo Operator",
            isDummy: true,
          };
          setUser(defaultDemo);
          localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(defaultDemo));
        }
      } else {
        const defaultDemo: UserProfile = {
          uid: "demo-user-101",
          email: "demo@cubiq.com",
          displayName: "Demo Operator",
          isDummy: true,
        };
        setUser(defaultDemo);
        localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(defaultDemo));
      }
      setLoading(false);
    }
  }, [isFirebaseActive]);

  const login = async (email: string, pass: string, isDummyMode = false): Promise<boolean> => {
    if (!email || !pass) {
      toast.error("Please enter email and password");
      return false;
    }

    if (isFirebaseActive && firebaseAuth && !isDummyMode) {
      try {
        const res = await signInWithEmailAndPassword(firebaseAuth, email, pass);
        const activeUser: UserProfile = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || email.split("@")[0] || "User",
          photoURL: res.user.photoURL || undefined,
          bio: "CUBIQ Microprocessor Operator",
          isDummy: false,
        };
        setUser(activeUser);
        await syncUserProfileToFirestore(activeUser);
        toast.success(`Welcome back, ${activeUser.displayName}`);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Firebase authentication failed";
        console.error("Firebase Login Error:", err);
        if (message.includes("api-key") || message.includes("API key")) {
          toast.error("Firebase API Key is missing in .env! Please set VITE_FIREBASE_API_KEY.");
        } else {
          toast.error(`Firebase Login Failed: ${message}`);
        }
        return false;
      }
    }

    // Instant Dummy / Mock Login
    const nameFromEmail = email.split("@")[0] || "Operator";
    const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    const dummyUser: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      photoURL: "/developer-nahian.jpg",
      bio: "CUBIQ Microprocessor Operator",
      isDummy: true,
    };
    setUser(dummyUser);
    localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(dummyUser));
    toast.success(`Logged in as ${displayName}`);
    return true;
  };

  const signup = async (name: string, email: string, pass: string, isDummyMode = false): Promise<boolean> => {
    if (!email || !pass) {
      toast.error("Please fill in all fields");
      return false;
    }

    if (isFirebaseActive && firebaseAuth && !isDummyMode) {
      try {
        const res = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
        if (name && res.user) {
          await updateProfile(res.user, { displayName: name });
        }
        const activeUser: UserProfile = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: name || email.split("@")[0] || "User",
          bio: "CUBIQ Microprocessor Operator & Developer",
          isDummy: false,
        };
        setUser(activeUser);
        await syncUserProfileToFirestore(activeUser);
        toast.success("Account created successfully in Firebase Auth & Firestore!");
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Firebase account creation failed";
        console.error("Firebase Signup Error:", err);
        if (message.includes("api-key") || message.includes("API key")) {
          toast.error("Firebase API Key is missing in .env! Please set VITE_FIREBASE_API_KEY.");
        } else {
          toast.error(`Firebase Signup Error: ${message}`);
        }
        return false;
      }
    }

    // Instant Dummy Signup
    const dummyUser: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName: name || email.split("@")[0] || "New Operator",
      photoURL: "/developer-nahian.jpg",
      bio: "CUBIQ Microprocessor Operator & Developer",
      isDummy: true,
    };
    setUser(dummyUser);
    localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(dummyUser));
    toast.success(`Account created for ${dummyUser.displayName}`);
    return true;
  };

  const logout = async () => {
    if (isFirebaseActive && firebaseAuth) {
      try {
        await firebaseSignOut(firebaseAuth);
      } catch {
        // ignore
      }
    }
    setUser(null);
    localStorage.removeItem(DUMMY_STORAGE_KEY);
    toast.info("Logged out of CUBIQ");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isFirebaseActive }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
