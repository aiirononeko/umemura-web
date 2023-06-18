import Link from "next/link";

export default function Top() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">コース管理ページ</h1>
      <p>コース一覧</p>
      <ul>
        <li>コース1</li>
        <li>コース2</li>
        <li>コース3</li>
      </ul>
      <Link href="/admin">管理者ページへ</Link>
    </main>
  );
}
