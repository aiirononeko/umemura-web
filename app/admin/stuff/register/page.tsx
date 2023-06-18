"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Top() {
  const router = useRouter();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState(["男性", "女性"]);
  const [profile, setProfile] = useState("");

  const addStuff = async () => {
    try {
      const docRef = await addDoc(collection(db, "stuffs"), {
        firstName,
        lastName,
        gender,
        profile,
      });
      console.log("Document written with ID: ", docRef.id);

      router.push("/admin/stuff");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">スタッフ登録ページ</h1>
      <form className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              姓
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="梅村"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              名
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="祐貴"
            />
          </div>
        </div>
        <div className="relative">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            性別
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state"
          >
            <option value={gender}>男性</option>
            <option value={gender}>女性</option>
          </select>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6 mt-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              プロフィール
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              placeholder="精一杯頑張ります！"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
            />
          </div>
        </div>
      </form>
      <button
        onClick={addStuff}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        スタッフを登録する
      </button>
      <Link href="/admin/stuff">スタッフ管理ページへ</Link>
    </main>
  );
}
