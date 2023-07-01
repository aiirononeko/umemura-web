"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { Loader, TextInput, Button, Container, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { type Stuff } from "../../../_common/collection";

const SpinCss: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  backgroundColor: "#8888",
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Loding = () => {
  return (
    <div style={SpinCss}>
      <h1>Loding...</h1>
      <br />
      <Loader size='xl' />
    </div>
  );
};

const addStuff = async (stuff: Stuff, router: AppRouterInstance) => {
  const {firstName, lastName, gender, profile, email } = stuff;
  try {
    const docRef = await addDoc(collection(db, "stuffs"), {
      firstName,
      lastName,
      gender,
      profile,
      email,
    });
    console.log("Document written with ID: ", docRef.id);

    router.push("/admin/stuff");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default function Top() {
  const router = useRouter();

  const [stuff, setStuff] = useState<Stuff>({
    lastName: '',
    firstName: '',
    gender: '男性',
    profile: '',
    email: '',
  });

  return (
    {/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
        value={stuff.lastName}
        onChange={(e) => setStuff({...stuff, lastName: e.target.value})}
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
        value={stuff.firstName}
        onChange={(e) => setStuff({...stuff, firstName: e.target.value})}
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
        value={stuff.gender}
        onChange={(e) => setStuff({...stuff, gender: e.target.value})}
        >
        <option>男性</option>
        <option>女性</option>
        </select>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6 mt-6">
        <div className="w-full px-3">
        <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor="grid-password"
        >
        メールアドレス
        </label>
        <input
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="grid-first-name"
        type="text"
        value={stuff.email}
        onChange={(e) => setStuff({...stuff, email: e.target.value})}
        placeholder="umemura@example.com"
        />
        </div>
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
        value={stuff.profile}
        onChange={(e) => setStuff({...stuff, profile: e.target.value})}
        />
        </div>
        </div>
        </form>
        <button
        onClick={() => addStuff(stuff, router)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
        スタッフを登録する
        </button>
        <Link href="/admin/stuff">スタッフ管理ページへ</Link>
        </main> */}
  );
}
