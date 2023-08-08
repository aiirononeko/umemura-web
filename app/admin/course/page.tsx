"use client";

import { useEffect, useState } from "react";
import { type Course } from "../../firebase/service/collection";
import {
  Button,
  Center,
  Container,
  Group,
  Modal,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { getUid } from "@/app/firebase/service/authentication";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

export default function Top() {
  const uid = getUid();

  const [courses, setCourses] = useState<Course[]>([]);

  const [opened, { open, close }] = useDisclosure();

  const [targetCourse, setTargetCourse] = useState<Course | null>(null);

  const form = useForm({
    initialValues: {
      id: "",
      title: "",
      time: "",
      description: "",
      amount: "",
    } as Course,
  });

  useEffect(() => {
    if (uid) {
      const fetchCourses = async () => {
        try {
          const docRef = await getDocs(
            collection(db, "stuffs", uid, "courses")
          );
          const documents = docRef.docs.map((doc) => doc.data());
          setCourses(documents as Course[]);
        } catch (e) {
          console.error("Error adding document: ", e);
          return [];
        }
      };
      fetchCourses();
    }
  }, [uid]);

  const addCourse = async (course: Course): Promise<void> => {
    try {
      if (uid) {
        const docRef = collection(db, "stuffs", uid, "courses");
        const result = await addDoc(docRef, {
          ...course,
        });
        await setDoc(
          result,
          {
            id: result.id,
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateCourse = async (course: Course): Promise<void> => {
    try {
      if (uid) {
        const docRef = doc(db, "stuffs", uid, "courses", course.id);
        await setDoc(
          docRef,
          {
            ...course,
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteCourse = async (id: string): Promise<void> => {
    try {
      if (uid) {
        const docRef = doc(db, "stuffs", uid, "courses", id);
        deleteDoc(docRef);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <Center>
        <Title mb={30}>コース管理</Title>
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
            <th>値引</th>
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
              <td>{course.discount}</td>
              <td
                onClick={(): void => {
                  setTargetCourse(course);
                  form.setValues(course);
                  open();
                }}
              >
                編集
              </td>
              <td
                onClick={(): void => {
                  const result = window.confirm("削除しますか？");
                  if (result) {
                    deleteCourse(course.id);
                  }
                }}
              >
                削除
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="予約可能日時登録"
        size="80%"
      >
        <form
          onSubmit={form.onSubmit(async (value) => {
            if (targetCourse) {
              await updateCourse({
                ...targetCourse,
                ...value,
              });
              setTargetCourse(null);
            } else {
              await addCourse(value);
            }
            form.reset();
            close();
          })}
        >
          <TextInput
            label="コース名"
            placeholder="ホニャホニャコース"
            required
            {...form.getInputProps("title")}
            mb="lg"
          />
          <TextInput
            label="背術時間"
            placeholder="60"
            required
            type="number"
            {...form.getInputProps("time")}
            mb="lg"
          />
          <TextInput
            label="コース説明"
            placeholder="ホニャホニャなコースです"
            required
            {...form.getInputProps("description")}
            mb="lg"
          />
          <TextInput
            label="金額"
            placeholder="3000"
            required
            type="number"
            {...form.getInputProps("amount")}
            mb="lg"
          />
          <TextInput
            label="値引"
            placeholder="2500"
            required
            type="number"
            {...form.getInputProps("discount")}
            mb="lg"
          />
          <div className="pt-4">
            <Center>
              <Group mt={20}>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
                  color="green"
                >
                  登録
                </Button>
              </Group>
            </Center>
          </div>
        </form>
      </Modal>

      <Button
        w={50}
        h={50}
        radius={"50%"}
        color={"green"}
        onClick={open}
        style={{
          position: "fixed",
          bottom: "18%",
          right: "13%",
        }}
      >
        <Text size={"xl"}>+</Text>
      </Button>
    </>
  );
}
