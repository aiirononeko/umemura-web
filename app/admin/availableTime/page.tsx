"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, where, query } from "firebase/firestore";

export default function Top() {
  const [availableTimes, setAvailableTimes] = useState([]);

  const getAvailableTimes = async () => {
    try {
      const availableTimes: any = [];
      const q = query(
        collection(db, "available_times"),
        where("isBlocked", "==", false)
      );
      const docRef = await getDocs(q);
      docRef.forEach((doc) => {
        availableTimes.push(doc.data());
      });
      setAvailableTimes(availableTimes);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    getAvailableTimes();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">予約可能日時管理ページ</h1>
      <Link href="/admin/availableTime/register" className="pb-5">
        予約可能日時を登録する
      </Link>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-20 py-6">開始日時</th>
            <th className="px-20 py-6">終了日時</th>
          </tr>
        </thead>
        {availableTimes.map((availableTime: any, index) => (
          <tbody
            key={`${availableTime.startDate}_${availableTime.endDate}_${index}`}
          >
            <tr>
              <td className="border px-4 py-2">{availableTime.startDate}</td>
              <td className="border px-4 py-2">{availableTime.endDate}</td>
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
