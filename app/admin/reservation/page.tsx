"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Top() {
  const [reservations, setReservations] = useState([]);

  const getReservations = async () => {
    try {
      const reservations: any = [];
      const docRef = await getDocs(collection(db, "stuffs"));
      docRef.forEach((doc) => {
        reservations.push(doc.data());
      });
      setReservations(reservations);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    getReservations();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">予約管理ページ</h1>
      <Link href="/admin/reservation/register" className="pb-5">
        予約可能日時を登録する
      </Link>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-20 py-6">スタッフ名</th>
            <th className="px-20 py-6">性別</th>
            <th className="px-20 py-6">プロフィール</th>
          </tr>
        </thead>
        {reservations.map((reservation: any, index) => (
          <tbody
            key={`${reservation.firstName}_${reservation.lastName}_${index}`}
          >
            <tr>
              <td className="border px-4 py-2">{`${reservation.lastName} ${reservation.firstName}`}</td>
              <td className="border px-4 py-2">{reservation.gender}</td>
              <td className="border px-4 py-2">{reservation.profile}</td>
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
