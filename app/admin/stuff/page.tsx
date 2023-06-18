import Link from "next/link";

export default function Top() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">スタッフ管理ページ</h1>
      <Link href="/admin/stuff/register">スタッフを登録する</Link>
      <p>スタッフ一覧</p>
      <ul>
        <li>梅村</li>
        <li>片田</li>
        <li>岡本</li>
      </ul>
      <Link href="/admin">管理者ページへ</Link>
    </main>
  );
}
