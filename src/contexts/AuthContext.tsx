"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface AuthContextType {
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  session: Session | null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  return (
    <AuthContext.Provider value={{ session, status }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { useSession };

export function useUser() {
  const { session } = useAuth();
  return session?.user ?? null;
}
