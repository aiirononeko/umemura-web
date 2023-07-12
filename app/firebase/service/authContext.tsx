"use client";

import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../config";
import { useSearchParams } from "next/navigation";

interface ContextValue {
  user: User | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

function builderContextValue(user: User | null) {
  return {
    user,
  } as ContextValue;
}

export const AuthContext = createContext<Partial<ContextValue>>({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [contextValue, setContextValue] = useState<ContextValue>(
    builderContextValue(null)
  );
  useSearchParams().get("logout");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setContextValue(builderContextValue(user));
      } else {
        setContextValue(builderContextValue(null));
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
