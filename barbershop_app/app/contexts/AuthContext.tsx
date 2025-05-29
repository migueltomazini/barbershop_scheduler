// app/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"; // Added ReactNode
import { toast } from "sonner";

// Allowed user roles
type UserRole = "client" | "admin";

export type User = { // Export User type if needed by other components like AdminPage
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
};

export type MockUserWithPassword = User & { password?: string };

// Type for data passed to signup function
export type SignupData = {
    name: string;
    email: string;
    phone: string;
    password?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (signupData: SignupData) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  mockUsers: MockUserWithPassword[]; // <--- ADICIONADO AQUI
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) { // Used ReactNode
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Store mock users in state so we can add to it
  const [mockUsers, setMockUsers] = useState<MockUserWithPassword[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin",
      password: "admin",
      phone: "555-1234",
      role: "admin" as UserRole,
    },
    {
      id: "2",
      name: "Client User",
      email: "client@example.com",
      password: "password",
      phone: "555-5678",
      role: "client" as UserRole,
      address: "123 Main St",
    },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem("barber-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem("barber-user", JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("barber-user");
    toast.success("You have been logged out successfully."); // Translated
  };

  const signup = async (
    signupData: SignupData
  ): Promise<{ success: boolean; message?: string }> => {
    const { name, email, phone, password } = signupData;
    if (mockUsers.some((u) => u.email === email)) {
      return { success: false, message: "This email is already in use." }; // Translated
    }
    const newUser: MockUserWithPassword = {
      id: String(mockUsers.length + 1 + Date.now()), name, email, phone, password,
      role: "client" as UserRole, address: "",
    };
    setMockUsers((prevUsers) => [...prevUsers, newUser]);
    const { password: _, ...userToStore } = newUser;
    setUser(userToStore);
    localStorage.setItem("barber-user", JSON.stringify(userToStore));
    return { success: true };
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, isAuthenticated, isAdmin, mockUsers }} // <--- mockUsers ADICIONADO AO VALOR
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};