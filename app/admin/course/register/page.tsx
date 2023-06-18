"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Top() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  const addCourse = async () => {
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        title,
        time,
        description,
        amount,
      });
      console.log("Document written with ID: ", docRef.id);

      router.push("/admin/course");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">コース登録ページ</h1>
      <form className="w-full max-w-lg">
        <div className="relative pb-10">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            コース名
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-first-name"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ホニャホニャコース"
          />
        </div>
        <div className="relative pb-10">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            背術時間
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-first-name"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="1時間"
          />
        </div>
        <div className="relative pb-10">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            コース説明
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-first-name"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ホニャホニャなコースです"
          />
        </div>
        <div className="relative">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            金額
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-first-name"
            type="text"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            placeholder="3000"
          />
        </div>
      </form>
      <button
        onClick={addCourse}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        コースを登録する
      </button>
      <Link href="/admin/stuff">スタッフ管理ページへ</Link>
    </main>
  );
}
