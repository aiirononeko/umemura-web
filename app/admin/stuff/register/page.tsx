"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TextInput,
  Button,
  Container,
  Center,
  Group,
  Select,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { registerStuffWithSendingEmail } from "../../../firebase/service/authentication";
import { Loading } from "../../../firebase/service/loading";

const genderData = [
  { value: "男性", label: "男性" },
  { value: "女性", label: "女性" },
];
export default function Top() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      lastName: "",
      firstName: "",
      gender: "男性",
      email: "",
      profile: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
          ? null
          : "メールアドレスを正しく入力してください",
    },
  });
  const [loading, setLoading] = useState(false);

  return (
    <Container className="m-auto " size="xs">
      <Center>
        <Title className="mb-12">スタッフ登録</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) => {
          registerStuffWithSendingEmail(
            values,
            setLoading,
            router,
            "/admin/stuff"
          );
        })}
      >
        <Group grow>
          <TextInput
            size="xs"
            label="姓"
            placeholder="梅村"
            required
            {...form.getInputProps("lastName")}
            mb="lg"
          />
          <TextInput
            size="xs"
            label="名"
            placeholder="祐貴"
            required
            {...form.getInputProps("firstName")}
            mb="lg"
          />
        </Group>
        <Select
          size="xs"
          label="性別"
          required
          {...form.getInputProps("gender")}
          mb="lg"
          data={genderData}
        />
        <TextInput
          size="xs"
          label="メールアドレス"
          placeholder="メールアドレス"
          required
          {...form.getInputProps("email")}
          mb="lg"
        />
        <Center className="mt-4">
          <Group>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
            >
              登録
            </Button>
            <Button
              component={Link}
              href="/admin/stuff"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold"
            >
              戻る
            </Button>
          </Group>
        </Center>
      </form>
      {loading ? <Loading /> : <></>}
    </Container>
  );
}
