import React from "react";
import Footer from "./_common/footer";
import HeaderResponsive from "./_common/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./firebase/service/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Holistic Beauty Salon - Le Miijou",
  description:
    "ホリスティックビューティーサロン ルミージュの公式サイトです。お店の概要や、オンライン予約はこちらから。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <HeaderResponsive />
          {children}
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
