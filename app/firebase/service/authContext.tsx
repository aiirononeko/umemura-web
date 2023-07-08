"use client";

import { User } from "firebase/auth";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { auth } from "../config";

interface ContextValue {
  user: User | null;
  isStuff: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

function builderContextValue(user: User | null, isStuff: boolean) {
  return {
    user,
    isStuff,
  } as ContextValue;
}

export const AuthContext = createContext<Partial<{contextValue: ContextValue, setContextValue: Dispatch<SetStateAction<ContextValue>>}>>({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [contextValue, setContextValue] = useState<ContextValue>(builderContextValue(null, false));
  /* console.log(contextValue); */
  useEffect(() => {
    auth.onAuthStateChanged(user  => {
      if (user) {
        setContextValue({ user, isStuff: contextValue.isStuff });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ contextValue, setContextValue }}>
      {children}
    </AuthContext.Provider>
  )
};
