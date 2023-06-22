"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AvailableTimeRegister() {
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isBlocked, _] = useState(false);

  const addAvailableTime = async () => {
    console.log(startDate);
    console.log(endDate);
    console.log(isBlocked);
    try {
      const docRef = await addDoc(collection(db, "available_times"), {
        startDate,
        endDate,
        isBlocked,
      });
      console.log("Document written with ID: ", docRef.id);

      router.push("/admin/availableTime");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">予約可能日時登録ページ</h1>
      <form className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              開始日時
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-last-name"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="text"
              placeholder="2023/06/22-10:00"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              終了日時
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-first-name"
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2023/06/22-11:00"
            />
          </div>
        </div>
      </form>
      <button
        onClick={addAvailableTime}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        予約可能日時を登録する
      </button>
      <Link href="/admin/availableTime">予約可能日時一覧ページへ</Link>
    </main>
  );
}
