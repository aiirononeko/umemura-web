import Link from "next/link";

export default function Reserve() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">予約</h1>
      <Link href="/">トップページへ</Link>
    </main>
  );
}
