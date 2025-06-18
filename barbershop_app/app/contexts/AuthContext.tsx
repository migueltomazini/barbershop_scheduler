/**
 * @file barbershop_app/app/contexts/AuthContext.tsx
 * @description This file defines the authentication context for the application. It handles user state,
 * login, logout, signup, and provides authentication status (isAuthenticated, isAdmin) to its children components.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { User, UserRole, SignupData, MockUserWithPassword } from "@/app/types";

/**
 * @type AuthContextType
 * @description Defines the shape of the data and functions provided by the AuthContext.
 */
type AuthContextType = {
  user: User | null; // The current authenticated user object, or null if not logged in.
  login: (email: string, password: string) => Promise<boolean>; // Function to log in a user.
  logout: () => void; // Function to log out the current user.
  signup: (
    signupData: SignupData
  ) => Promise<{ success: boolean; message?: string }>; // Function to register a new user.
  isAuthenticated: boolean; // A boolean flag indicating if a user is logged in.
  isAdmin: boolean; // A boolean flag indicating if the logged-in user is an administrator.
  updateUserContext: (updatedUser: User) => void; // Function to update user data in the context.
};

// Create the context with an initial undefined value.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:3001";

/**
 * @component AuthProvider
 * @description A provider component that wraps the application and makes authentication data available
 * to all child components via the `useAuth` hook.
 * @param {{ children: ReactNode }} props - The child components to be rendered within the provider.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On initial load, check for a saved user session in localStorage.
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("barber-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("barber-user");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * @function login
   * @description Authenticates a user by checking their credentials against the mock API.
   * On success, it stores the user data in state and localStorage.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} True if login is successful, false otherwise.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    // A simplified login for the demo. In a real app, this would be a POST request.
    const trimmedEmail = email.trim();
    try {
      const res = await fetch(`${API_BASE_URL}/users?email=${trimmedEmail}`);
      if (!res.ok) throw new Error("Server error");
      const users: MockUserWithPassword[] = await res.json();

      // Find the user and check if the password matches.
      const foundUser = users.find((u) => u.password === password);

      if (foundUser) {
        // Remove password before storing user data.
        const { password: _password, ...userToStore } = foundUser;
        void _password; // Explicitly mark as unused to satisfy linters.
        setUser(userToStore as User);
        localStorage.setItem("barber-user", JSON.stringify(userToStore));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login API error:", error);
      return false;
    }
  };

  /**
   * @function logout
   * @description Clears the user's session from state and localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("barber-user");
    toast.success("You have been logged out successfully.");
  };

  /**
   * @function signup
   * @description Registers a new user. It checks if the email is already in use before creating the account.
   * @param {SignupData} signupData - The data for the new user, including address.
   * @returns {Promise<{ success: boolean; message?: string }>} An object indicating success or failure.
   */
  const signup = async (
    signupData: SignupData
  ): Promise<{ success: boolean; message?: string }> => {
    const { name, email, phone, password, address } = signupData;

    try {
      // Check if the email is already registered.
      const emailCheckRes = await fetch(`${API_BASE_URL}/users?email=${email}`);
      if (!emailCheckRes.ok) throw new Error("Failed to check email.");
      const existingUsers = await emailCheckRes.json();
      if (existingUsers.length > 0) {
        return { success: false, message: "This email is already in use." };
      }

      // Create the new user with a 'client' role by default.
      const newUserPayload = {
        name,
        email,
        phone,
        password,
        address,
        role: "client" as UserRole,
      };

      const createRes = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserPayload),
      });

      if (!createRes.ok) throw new Error("Failed to create user on server.");

      const createdUser: MockUserWithPassword = await createRes.json();

      // Log the new user in immediately.
      const { password: _password, ...userToStore } = createdUser;
      void _password;
      setUser(userToStore as User);
      localStorage.setItem("barber-user", JSON.stringify(userToStore));
      return { success: true };
    } catch (error) {
      console.error("Signup API error:", error);
      const message =
        error instanceof Error ? error.message : "A server error occurred.";
      return { success: false, message };
    }
  };

  /**
   * @function updateUserContext
   * @description Updates the authenticated user's data in the context. Used after a profile update.
   * @param {User} updatedUser - The new user object.
   */
  const updateUserContext = (updatedUser: User) => {
    // Only update if the modified user is the currently logged-in user.
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem("barber-user", JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  // Provide the context value to child components.
  // The `!loading` check prevents rendering children before authentication status is determined.
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

/**
 * @hook useAuth
 * @description A custom hook to easily access the AuthContext from any component within the AuthProvider.
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
