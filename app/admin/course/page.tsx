"use client";

import Link from "next/link";
import { useState } from "react";
import { type Course, getCollection } from "@/app/_common/collection";
import { Center, Container, Table, Title } from "@mantine/core";

// firebaseが治り次第修正する
const rows: Course[] = [
  {
    title: "コース名",
    time: "背術時間",
    description: "コース説明",
    amount: "金額",
  },
  {
    title: "コース名",
    time: "背術時間",
    description: "adjf:aldjkf:alkdjf:alkjdf:alkdjf",
    amount: "金額",
  },
  {
    title: "コース名",
    time: "背術時間",
    description: "なにぬねの",
    amount: "金額",
  },
  {
    title: "コース名",
    time: "背術時間",
    description: "はひふへほ",
    amount: "金額",
  },
  {
    title: "コース名",
    time: "背術時間",
    description: "asd:lkfja:sdlfj:alksdjfafadfadfadfadfadfadfadsfadfads:",
    amount: "金額",
  },
  {
    title: "コース名",
    time: "背術時間",
    description: "asdfkja:lsdfjka:lsdkjfa:lkdsjfa:",
    amount: "金額",
  },
];

export default function Top() {
  const [courses, setCourses] = useState<Course[]>([]);
  getCollection("courses", setCourses);

  return (
    <>
      <Container className="m-auto">
        <Center>
          <Title className="mb-12">コース管理</Title>
        </Center>
        <Table
          className="whitespace-nowrap"
          verticalSpacing="xl"
          striped
          withBorder
          withColumnBorders
        >
          <thead>
            <tr>
              <th>コース名</th>
              <th>背術時間</th>
              <th>コース説明</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((course: Course, index) => (
              <tr key={`${course.title}_${index}`}>
                <td>{course.title}</td>
                <td>{course.time}</td>
                <td style={{ maxWidth: "40vw" }} className="truncate">
                  {course.description}
                </td>
                <td>{course.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Center className="mt-12">
          <Link href="/admin">管理者画面ページ</Link>
        </Center>
      </Container>
    </>
  );
}
