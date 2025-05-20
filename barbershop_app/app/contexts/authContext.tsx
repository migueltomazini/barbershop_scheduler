"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Allowed user roles
type UserRole = "client" | "admin";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on mount
    const savedUser = localStorage.getItem("barber-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Mock users for demonstration
  const mockUsers = [
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
  ];

  // Handles login logic by checking credentials against mock data
  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("barber-user", JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  // Logs out the user by clearing state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("barber-user");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isAdmin }}
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
