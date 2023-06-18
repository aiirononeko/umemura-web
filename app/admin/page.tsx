import Link from "next/link";

export default function Reserve() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">管理者ページ</h1>
      <Link href="/admin/reserve">予約を管理する</Link>
      <Link href="/admin/course">コースを管理する</Link>
      <Link href="/admin/stuff">スタッフを管理する</Link>
      <Link href="/">トップページへ</Link>
    </main>
  );
}
