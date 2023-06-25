'use client';

import Link from "next/link";

export default function Top() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">梅村のサイト</h1>
      <Link href="/reservation" className="pb-10">
        予約ページへ
      </Link>
      <Link href="/admin">管理者ページへ</Link>
    </main>
  );
}
