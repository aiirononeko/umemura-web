"use client";

import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../config";

export const AuthContext = createContext<Partial<User> | null>({});

/* export const useAuthContext = () => {
 *   return useContext(AuthContext);
 * } */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  useEffect(() => {
    auth.onAuthStateChanged(user  => {
      setUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  )
};
