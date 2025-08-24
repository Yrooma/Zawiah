
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/services';
import { AVATAR_COLORS } from '@/lib/config';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<AppUser>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async (firebaseUser: FirebaseUser) => {
      const profile = await getUserProfile(firebaseUser.uid);
      setUser(profile);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUser]);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    
    const avatarText = name.charAt(0).toUpperCase();
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const avatarUrl = `https://placehold.co/100x100/${avatarColor.substring(1)}/FFFFFF?text=${encodeURIComponent(avatarText)}`;

    const newUser: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      avatarUrl,
      avatarText,
      avatarColor
    };

    await setDoc(doc(db, "users", firebaseUser.uid), {
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        avatarText: newUser.avatarText,
        avatarColor: newUser.avatarColor,
    });
    
    setUser(newUser);
    return newUser;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const refreshUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
          await fetchUser(currentUser);
      }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('يجب استخدام useAuth ضمن AuthProvider');
  }
  return context;
};
