"use client";

import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../config";
import { getDocuments } from "./collection";
import { useSearchParams } from "next/navigation";

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

export const AuthContext = createContext<Partial<ContextValue>>({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [contextValue, setContextValue] = useState<ContextValue>(builderContextValue(null, false));
  const logoutParams = useSearchParams().get("logout");
  console.log(logoutParams);
  useEffect(() => {
    auth.onAuthStateChanged(user  => {
      if (user) {
        console.log(user);
        getDocuments("stuffs").then((stuffs) => {
          const targetStuff = stuffs.find(s => s.id === user.uid)
          setContextValue(builderContextValue(user, targetStuff ? true : false));
        });
      } else {
        setContextValue(builderContextValue(null, false));
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
};
