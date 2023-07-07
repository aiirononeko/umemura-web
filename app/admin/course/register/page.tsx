"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type Course,
  addSubCollectionDocument,
} from "../../../firebase/service/collection";
import {
  Container,
  Title,
  Center,
  TextInput,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Loading } from "../../../firebase/service/loading";
import { getUid } from "@/app/firebase/service/authentication";

export default function Top() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
      time: "",
      description: "",
      amount: "",
    } as Course,
    validate: {
      amount: (value) =>
        /^[1-9][0-9]*$/.test(value) ? null : "金額は半角数字で入力してください",
    },
  });

  const uid = getUid();

  return (
    <Container className="m-auto " size="xs">
      <Center>
        <Title className="mb-12">コース登録</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) =>
          addSubCollectionDocument(
            values,
            "stuffs",
            uid ?? "",
            "courses",
            setLoading,
            router,
            "admin/course"
          )
        )}
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
          placeholder="1時間"
          required
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
          {...form.getInputProps("amount")}
          mb="lg"
        />
        <div className="pt-4">
          <Center>
            <Group>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
              >
                登録
              </Button>
              <Button
                component={Link}
                href="/admin/course"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold"
              >
                戻る
              </Button>
            </Group>
          </Center>
        </div>
      </form>
      {loading ? <Loading /> : <></>}
    </Container>
  );
}
