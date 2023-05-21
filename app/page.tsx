import Link from "next/link";

export default function Top() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">梅村のサイト</h1>
      <Link href="/reserve">予約ページへ</Link>
    </main>
  );
}
