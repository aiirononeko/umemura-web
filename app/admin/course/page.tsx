"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type Course, getDocuments } from "../../firebase/service/collection";
import { Center, Container, Table, Title } from "@mantine/core";

export default function Top() {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    getDocuments("courses").then((courses) => {
      setCourses(courses as Course[]);
    });
  }, []);

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
            {courses.map((course: Course, index) => (
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
