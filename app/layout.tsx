'use client';

import React from "react";
import Footer from "./_common/footer";
import Header from "./_common/header";
import "./globals.css";
import { Inter } from "next/font/google";

interface loginUser {
  name: string,
  email: string,
  uid: string,
};

function builderLoginUser(name: string, email: string, uid: string) {
  return {
    name,
    email,
    uid,
  } as loginUser;
}

const initLoginUser = builderLoginUser('', '', '');
const LoginUserContext = React.createContext(initLoginUser);
const inter = Inter({ subsets: ["latin"] });

/* export const metadata = {
 *   title: "Create Next App",
 *   description: "Generated by create next app",
 * }; */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <LoginUserContext.Provider value={initLoginUser}>
          <Header />
          {children}
          <Footer />
        </LoginUserContext.Provider>
      </body>
    </html>
  );
}
