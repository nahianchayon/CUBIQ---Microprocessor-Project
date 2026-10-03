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
import {
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
} from "./firestore-service";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  role?: string;
  isDummy?: boolean;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string, isDummyMode?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, isDummyMode?: boolean) => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
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
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          const firestoreProfile = await fetchUserProfileFromFirestore(fbUser.uid);
          const activeUser: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || "user@cubiq.com",
            displayName: fbUser.displayName || firestoreProfile?.displayName || fbUser.email?.split("@")[0] || "CUBIQ Member",
            photoURL: fbUser.photoURL || firestoreProfile?.photoURL || undefined,
            bio: firestoreProfile?.bio || "CUBIQ Microprocessor Operator",
            role: firestoreProfile?.role || "Operator",
            isDummy: false,
          };
          setUser(activeUser);
          await syncUserProfileToFirestore(activeUser);
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
          const defaultDemo: UserProfile = {
            uid: "demo-user-101",
            email: "demo@cubiq.com",
            displayName: "Demo Operator",
            photoURL: "/developer-nahian.jpg",
            bio: "CUBIQ Microprocessor Operator & Developer",
            role: "Developer",
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
          photoURL: "/developer-nahian.jpg",
          bio: "CUBIQ Microprocessor Operator & Developer",
          role: "Developer",
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
        const firestoreProfile = await fetchUserProfileFromFirestore(res.user.uid);
        const activeUser: UserProfile = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || firestoreProfile?.displayName || email.split("@")[0] || "User",
          photoURL: res.user.photoURL || firestoreProfile?.photoURL || undefined,
          bio: firestoreProfile?.bio || "CUBIQ Microprocessor Operator",
          role: firestoreProfile?.role || "Operator",
          isDummy: false,
        };
        setUser(activeUser);
        await syncUserProfileToFirestore(activeUser);
        toast.success(`Welcome back, ${activeUser.displayName}`);
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Firebase authentication failed";
        console.error("Firebase Login Error:", err);
        if (message.includes("user-not-found") || message.includes("wrong-password") || message.includes("invalid-credential")) {
          toast.error("Invalid email or password. Please check your credentials or Sign Up.");
        } else {
          toast.error(`Login failed: ${message}`);
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
      role: "Operator",
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
          bio: "CUBIQ Microprocessor Operator",
          role: "Operator",
          isDummy: false,
        };
        setUser(activeUser);
        await syncUserProfileToFirestore(activeUser);
        toast.success("Account created successfully in Firebase Auth & Firestore!");
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Firebase account creation failed";
        console.error("Firebase Signup Error:", err);
        if (message.includes("email-already-in-use")) {
          toast.error("An account with this email already exists. Please Log In instead.");
        } else if (message.includes("weak-password")) {
          toast.error("Password is too weak. Please use at least 6 characters.");
        } else {
          toast.error(`Signup failed: ${message}`);
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
      bio: "CUBIQ Microprocessor Operator",
      role: "Operator",
      isDummy: true,
    };
    setUser(dummyUser);
    localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(dummyUser));
    toast.success(`Account created for ${dummyUser.displayName}`);
    return true;
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = { ...user, ...updates };
    setUser(updated);

    if (updated.isDummy) {
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(updated));
    }

    if (isFirebaseActive && firebaseAuth && firebaseAuth.currentUser) {
      try {
        await updateProfile(firebaseAuth.currentUser, {
          displayName: updates.displayName ?? user.displayName,
          photoURL: updates.photoURL ?? user.photoURL,
        });
      } catch (err) {
        console.warn("Firebase Auth updateProfile notice:", err);
      }
    }

    try {
      await syncUserProfileToFirestore(updated);
    } catch (err) {
      console.warn("Firestore sync error:", err);
    }

    toast.success("Profile updated in Firebase Auth & Cloud Firestore");
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
    <AuthContext.Provider
      value={{ user, loading, login, signup, updateUserProfile, logout, isFirebaseActive }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
