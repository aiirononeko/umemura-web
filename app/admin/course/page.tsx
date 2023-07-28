"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Course,
  getSubcollectionDocuments,
  deleteSubCollectionDocument,
} from "../../firebase/service/collection";
import { Button, Center, Container, Table, Title } from "@mantine/core";
import { getUid } from "@/app/firebase/service/authentication";

export default function Top() {
  const [courses, setCourses] = useState<Course[]>([]);
  const uid = getUid();

  useEffect(() => {
    getSubcollectionDocuments("stuffs", uid ?? "", "courses").then(
      (courses) => {
        setCourses(courses as Course[]);
      }
    );
  }, []);

  const updateCourse = async (course: Course) => {
    console.log("update");
  };

  const deleteCourse = async (id: string) => {
    const result = window.confirm("本当に削除しますか？");
    if (result)
      await deleteSubCollectionDocument("stuffs", uid ?? "", "courses", id);
  };

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
              <th>施術時間</th>
              <th>コース説明</th>
              <th>金額</th>
              <th></th>
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
                <td
                  onClick={async (): Promise<void> =>
                    await updateCourse(course)
                  }
                >
                  編集
                </td>
                <td
                  onClick={async (): Promise<void> =>
                    await deleteCourse(course.id)
                  }
                >
                  削除
                </td>
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
