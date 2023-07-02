"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type Course, getDocuments } from "../../firebase/service/collection";
import { Box, Button, Center, Container, Grid, Group, Table, Title } from "@mantine/core";

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
        <Center className="">
          <Title>コース管理</Title>
        </Center>
        <Center>
          <Button
            component={Link}
            href="/admin/course/register"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-4"
          >
            コース追加
          </Button>
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
        <Center>
          <Button
            component={Link}
            href="/admin"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold my-4"
          >
            戻る
          </Button>
        </Center>
      </Container>
    </>
  );
}
