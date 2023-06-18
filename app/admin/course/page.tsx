"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Top() {
  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    try {
      const courses: any = [];
      const docRef = await getDocs(collection(db, "courses"));
      docRef.forEach((doc) => {
        courses.push(doc.data());
      });
      setCourses(courses);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold pb-10">コース管理ページ</h1>
      <Link href="/admin/course/register" className="pb-5">
        コースを登録する
      </Link>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-20 py-6">コース名</th>
            <th className="px-20 py-6">背術時間</th>
            <th className="px-20 py-6">コース説明</th>
            <th className="px-20 py-6">金額</th>
          </tr>
        </thead>
        {courses.map((course: any, index) => (
          <tbody key={`${course.title}_${index}`}>
            <tr>
              <td className="border px-4 py-2">{course.title}</td>
              <td className="border px-4 py-2">{course.time}</td>
              <td className="border px-4 py-2">{course.description}</td>
              <td className="border px-4 py-2">{course.amount}</td>
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
