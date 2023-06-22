import Link from "next/link";

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">管理者ページ</h1>
      <Link href="/admin/reservation" className="pb-10">
        予約を管理する
      </Link>
      <Link href="/admin/availableTime" className="pb-10">
        予約可能日時を管理する
      </Link>
      <Link href="/admin/course" className="pb-10">
        コースを管理する
      </Link>
      <Link href="/admin/stuff" className="pb-10">
        スタッフを管理する
      </Link>
      <Link href="/">トップページへ</Link>
    </main>
  );
}
