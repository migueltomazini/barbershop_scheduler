/**
 * @file barbershop_app/app/contexts/AuthContext.tsx
 * @description Provides a global authentication context for the application,
 * exposing the current session and a method to update the user data in the client state.
 * 
 * This context is intended to be initialized with a session object fetched on the server side.
 */

"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { User, SessionType } from "@/app/types";

/**
 * AuthContextType
 *
 * Defines the shape of the authentication context.
 * - `session`: The authenticated session information, or `null` if not logged in.
 * - `updateUserContext`: A helper to update the current user details in the client-side context.
 */
type AuthContextType = {
  session: SessionType | null;
  updateUserContext: (updatedUser: User) => void;
};

/**
 * AuthContext
 *
 * The React context object used to store and provide auth data to descendant components.
 * Initialized with `undefined` to ensure it must be wrapped by a provider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProviderProps
 *
 * Defines the props for the `AuthProvider` component.
 * - `children`: React nodes to render inside the provider.
 * - `serverSession`: The initial session object fetched on the server side.
 */
interface AuthProviderProps {
  children: ReactNode;
  serverSession: SessionType | null;
}

/**
 * AuthProvider
 *
 * Provides the authentication context to child components.
 * Initializes the session state with server-fetched data and exposes an updater
 * to modify user-specific fields in the client.
 *
 * @param {AuthProviderProps} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children, serverSession }: AuthProviderProps) {
  // Initialize the session state using the server-provided session data
  const [session, setSession] = React.useState(serverSession);

  /**
   * updateUserContext
   *
   * Updates the stored session with new user information.
   * Intended for cases when user data changes without a full page refresh.
   *
   * @param {User} updatedUser - The updated user object.
   */
  const updateUserContext = (updatedUser: User) => {
    if (session && session.userId === updatedUser._id) {
      setSession({
        ...session,
        name: updatedUser.name,
        // Add any other fields that may change on the fly.
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{ session, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth
 *
 * A custom hook to access the AuthContext.
 * Throws an error if used outside an `AuthProvider`.
 *
 * @returns {AuthContextType} The current authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
