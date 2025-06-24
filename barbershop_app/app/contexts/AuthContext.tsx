// app/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { User, SessionType } from "@/app/types";

// O contexto agora é mais simples
type AuthContextType = {
  session: SessionType | null;
  // Podemos manter uma forma de atualizar o usuário na UI, se necessário
  updateUserContext: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A props agora incluem a sessão vinda do servidor
interface AuthProviderProps {
  children: ReactNode;
  serverSession: SessionType | null;
}

export function AuthProvider({ children, serverSession }: AuthProviderProps) {
  // O estado agora é inicializado com a informação vinda do servidor!
  const [session, setSession] = React.useState(serverSession);

  // A função para atualizar o contexto pode ser mantida
  const updateUserContext = (updatedUser: User) => {
    if (session && session.userId === updatedUser._id) {
      setSession({
        ...session,
        name: updatedUser.name,
        // ...outros campos que possam mudar
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{ session, updateUserContext }}>
      {children}
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
