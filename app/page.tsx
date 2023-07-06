'use client';

import Link from "next/link";
import { auth } from "./firebase/config";
import { Button, Center, Container, Modal, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

const queryString = window.location.search;
const parameter = new URLSearchParams(queryString);
const email = parameter.get("email");

const SetPassword = () => {
  const form = useForm({
    initialValues: {
      email: email || "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
          ? null : "メールアドレスを正しく入力してください",
      password: (value) =>
        value.length < 6 ? "パスワードは6文字以上で入力してください" : null,
    },
  });

  return (
    <Container className="m-auto " size="xs">
      <Center>
        <Title className="mb-12">パスワード登録</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
        })}
      >
        <TextInput
          size="xs"
          label="メールアドレス"
          placeholder="メールアドレス"
          required
          disabled
          {...form.getInputProps("email")}
          mb="lg"
        />
        <TextInput
          size="xs"
          label="パスワード"
          placeholder="パスワード"
          required
          {...form.getInputProps("password")}
          mb="lg"
        />
        <Center className="mt-4">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
          >
            登録
          </Button>
        </Center>
      </form>
    </Container>
  );
}

export default function Top() {
  const currentUser = auth.currentUser;
  const [opened, { open, close }] = useDisclosure(email ? true : false);
  console.log(currentUser);
  return (
    <>
      <Modal opened={opened} onClose={close}>
        <SetPassword />
      </Modal>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold pb-10">梅村のサイト</h1>
        <Link href={currentUser ? "/reservation" : "signin"} className="pb-10">
          予約ページへ
        </Link>
        <Link href={currentUser ? "/admin" : "signin"}>管理者ページへ</Link>
      </main>
    </>
  );
}
