"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Top() {
  const [stuffs, setStuffs] = useState([]);

  const getStuffs = async () => {
    try {
      const stuffs: any = [];
      const docRef = await getDocs(collection(db, "stuffs"));
      docRef.forEach((doc) => {
        stuffs.push(doc.data());
      });
      setStuffs(stuffs);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    getStuffs();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">スタッフ管理ページ</h1>
      <Link href="/admin/stuff/register" className="pb-5">
        スタッフを登録する
      </Link>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-20 py-6">スタッフ名</th>
            <th className="px-20 py-6">性別</th>
            <th className="px-20 py-6">プロフィール</th>
          </tr>
        </thead>
        {stuffs.map((stuff: any, index) => (
          <tbody key={`${stuff.firstName}_${stuff.lastName}_${index}`}>
            <tr>
              <td className="border px-4 py-2">{`${stuff.lastName} ${stuff.firstName}`}</td>
              <td className="border px-4 py-2">{stuff.gender}</td>
              <td className="border px-4 py-2">{stuff.profile}</td>
            </tr>
          </tbody>
        ))}
      </table>
      <Link href="/admin" className="pt-10">
        管理者ページへ
      </Link>
    </main>
  );
}
