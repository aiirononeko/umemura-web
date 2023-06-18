import Link from "next/link";

export default function Top() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">予約管理ページ</h1>
      <p>予約一覧</p>
      <ul>
        <li>予約1</li>
        <li>予約2</li>
        <li>予約3</li>
      </ul>
      <Link href="/admin">管理者ページへ</Link>
    </main>
  );
}
