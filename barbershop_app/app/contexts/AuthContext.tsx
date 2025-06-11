// app/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { User, UserRole, SignupData, MockUserWithPassword } from "@/app/types"; // Make sure types are correctly imported

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (
    signupData: SignupData
  ) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUserContext: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:3001";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("barber-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const trimmedEmail = email.trim();
    try {
      const res = await fetch(`${API_BASE_URL}/users?email=${trimmedEmail}`);
      if (!res.ok) throw new Error("Server error");
      const users: MockUserWithPassword[] = await res.json();
      const foundUser = users.find((u) => u.password === password);

      if (foundUser) {
        const { password: _password, ...userToStore } = foundUser;
        setUser(userToStore);
        localStorage.setItem("barber-user", JSON.stringify(userToStore));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login API error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("barber-user");
    toast.success("You have been logged out successfully.");
  };

  const signup = async (
    signupData: SignupData
  ): Promise<{ success: boolean; message?: string }> => {
    const { name, email, phone, password } = signupData;

    try {
      // Check if email already exists
      const emailCheckRes = await fetch(`${API_BASE_URL}/users?email=${email}`);
      if (!emailCheckRes.ok) throw new Error("Failed to check email.");
      const existingUsers = await emailCheckRes.json();
      if (existingUsers.length > 0) {
        return { success: false, message: "This email is already in use." };
      }

      // Create the new user object to be sent to the API
      const newUserPayload = {
        name,
        email,
        phone,
        password,
        role: "client" as UserRole,
        address: "",
      };

      const createRes = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserPayload),
      });

      if (!createRes.ok) throw new Error("Failed to create user on server.");

      const createdUser: User = await createRes.json();

      // Log the new user in immediately after creation
      const { password: _password, ...userToStore } = createdUser;
      setUser(userToStore);
      localStorage.setItem("barber-user", JSON.stringify(userToStore));
      return { success: true };
    } catch (error) {
      console.error("Signup API error:", error);
      const message =
        error instanceof Error ? error.message : "A server error occurred.";
      return { success: false, message };
    }
  };

  const updateUserContext = (updatedUser: User) => {
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem("barber-user", JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isAuthenticated,
        isAdmin,
        updateUserContext,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
