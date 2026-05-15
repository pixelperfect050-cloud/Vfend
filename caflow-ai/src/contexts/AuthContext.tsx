"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "admin@caflow.ai",
    name: "CA Rajesh Sharma",
    phone: "+91 98765 43210",
    role: "admin",
    createdAt: new Date("2024-01-15"),
    lastActive: new Date(),
    preferences: { language: "both", darkMode: false, notifications: true, emailAlerts: true },
  },
  {
    id: "2",
    email: "staff@caflow.ai",
    name: "Priya Patel",
    phone: "+91 87654 32109",
    role: "staff",
    createdAt: new Date("2024-03-01"),
    lastActive: new Date(),
    preferences: { language: "en", darkMode: false, notifications: true, emailAlerts: false },
  },
  {
    id: "3",
    email: "client@caflow.ai",
    name: "Amit Kumar",
    phone: "+91 76543 21098",
    role: "client",
    createdAt: new Date("2024-06-01"),
    lastActive: new Date(),
    preferences: { language: "hi", darkMode: false, notifications: true, emailAlerts: true },
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("caflow_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("caflow_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const foundUser = DEMO_USERS.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("caflow_user", JSON.stringify(foundUser));
      setIsLoading(false);
      return;
    }
    if (email === "demo@caflow.ai" && password === "demo123") {
      const demoUser = DEMO_USERS[0];
      setUser(demoUser);
      localStorage.setItem("caflow_user", JSON.stringify(demoUser));
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    throw new Error("Invalid credentials");
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Math.random().toString(36).substring(2),
      email,
      name,
      role,
      createdAt: new Date(),
      lastActive: new Date(),
      preferences: { language: "en", darkMode: false, notifications: true, emailAlerts: true },
    };
    setUser(newUser);
    localStorage.setItem("caflow_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("caflow_user");
  };

  const googleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const googleUser = DEMO_USERS[0];
    setUser(googleUser);
    localStorage.setItem("caflow_user", JSON.stringify(googleUser));
    setIsLoading(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("caflow_user", JSON.stringify(updatedUser));
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, googleLogin, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
