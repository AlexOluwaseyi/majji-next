"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Session } from 'next-auth';

interface AuthContextType {
  session: Session | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  session: Session | null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const status = session ? 'authenticated' : 'unauthenticated';

  return (
    <AuthContext.Provider value={{ session, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Convenience hooks for common use cases
export function useSession() {
  const { session, status } = useAuth();
  return { data: session, status };
}

export function useUser() {
  const { session } = useAuth();
  return session?.user ?? null;
}