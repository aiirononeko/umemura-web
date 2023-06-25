'use client';

import Link from "next/link";
import { auth } from "./firebase/config";

export default function Top() {
  const currentUser = auth.currentUser;
  console.log(currentUser);
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">梅村のサイト</h1>
      <Link href={currentUser ? "/reservation" : "customers/login"} className="pb-10">
        予約ページへ
      </Link>
      <Link href={currentUser ? "/admin" : "customers/login"}>管理者ページへ</Link>
    </main>
  );
}
