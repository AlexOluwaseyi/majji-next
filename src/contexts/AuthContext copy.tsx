"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";
import prisma from "@/lib/prisma";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { generateUsername } from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    type: "seller" | "buyer"
  ) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    type: "seller" | "buyer",
    company?: string
  ) => Promise<void>;
  logout: () => void;
  errMsg?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const router = useRouter();

  const login = async (
    email: string,
    password: string,
    type: "seller" | "buyer"
  ) => {
    try {
      setIsLoading(true);

      // Simulate API call
      const user = await prisma.user.findUnique({
        where: { email: email, type: type },
      });

      if (!user) {
        setErrMsg("User does not exist. Please register first.");
        router.push("/auth?register=true");
      }

      if (user) {
        const isPasswordValid = await bcrypt.compare(
          password,
          user.password as string
        );
        if (!isPasswordValid) {
          setErrMsg("Invalid credentials. Please try again.");
        }

        setUser(user);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    type: "seller" | "buyer",
    company?: string
  ) => {
    try {
      setIsLoading(true);

      const hashedPassword = await bcrypt.hash(password, 10);

      // Simulate API call
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        setErrMsg("User already exists. Please login.");
        router.push("/auth");
        return;
      }

      const username = generateUsername(email);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          type,
          verified: false,
          username: username,
          company: company || null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          type: true,
          verified: true,
          username: true,
          company: true,
          isAdmin: true,
          createdAt: true,
        },
      });

      setUser(newUser);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "User creation failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, errMsg }}
    >
      {children}
    </AuthContext.Provider>
  );
};
