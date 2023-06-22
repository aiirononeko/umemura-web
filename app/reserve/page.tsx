import Link from "next/link";

export default function Reservation() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">予約</h1>
      <Link href="/">トップページへ</Link>
    </main>
  );
}
