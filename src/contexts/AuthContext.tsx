import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Subscription, UsageTracking } from '@/types';

export interface UserProfile {
  nickname: string;
  address: string;
  email: string;
  subscription?: Subscription;
  usage?: UsageTracking;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, nickname: string, address: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

async function fetchProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await fetchProfile(u.uid).catch(() => null);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signup(email: string, password: string, nickname: string, address: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userProfile: UserProfile = { nickname, address, email };
    await setDoc(doc(db, 'users', cred.user.uid), userProfile);
    setProfile(userProfile);
    await sendEmailVerification(cred.user).catch(() => {});
  }

  async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const p = await fetchProfile(cred.user.uid).catch(() => null);
    setProfile(p);
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    let p = await fetchProfile(cred.user.uid).catch(() => null);
    if (!p) {
      const newProfile: UserProfile = {
        nickname: cred.user.displayName ?? '',
        address: '',
        email: cred.user.email ?? '',
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      p = newProfile;
    }
    setProfile(p);
  }

  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  async function refreshProfile() {
    if (user) {
      const p = await fetchProfile(user.uid).catch(() => null);
      setProfile(p);
    }
  }

  async function resendVerification() {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, loginWithGoogle, logout, refreshProfile, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}
