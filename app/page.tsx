"use client";

import Link from "next/link";
import {
  Button,
  Center,
  Container,
  Modal,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { registerAuthenticate } from "./firebase/service/authentication";
import { useRouter, useSearchParams } from "next/navigation";
import { Loading } from "./firebase/service/loading";
import { AuthContext } from "./firebase/service/authContext";
import { Stuff } from "./firebase/service/collection";

const SetPassword = (props: {
  setLoading: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  router: AppRouterInstance;
  backPath: string;
  stuff: Stuff;
}) => {
  const { setLoading, router, backPath, onClose, stuff } = props;
  const form = useForm({
    initialValues: {
      email: stuff.email,
      password: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
          ? null
          : "メールアドレスを正しく入力してください",
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
          registerAuthenticate(
            stuff,
            "stuffs",
            values.password,
            setLoading,
            router,
            backPath,
            onClose
          );
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
          type="password"
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
};

function builderStuff(
  lastName: string,
  firstName: string,
  gender: string,
  email: string
) {
  return {
    lastName,
    firstName,
    gender,
    email,
    profile: "",
  } as Stuff;
}

export default function Top() {
  const currentUser = useContext(AuthContext).user;
  const params = useSearchParams();
  const lastName = params.get("lastName") || "";
  const firstName = params.get("firstName") || "";
  const gender = params.get("gender") || "";
  const email = params.get("email") || "";
  const [opened, { open, close }] = useDisclosure(email ? true : false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
      <Modal opened={opened} onClose={close}>
        <SetPassword
          setLoading={setLoading}
          onClose={close}
          router={router}
          backPath="/"
          stuff={builderStuff(lastName, firstName, gender, email)}
        />
      </Modal>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold pb-10">梅村のサイト</h1>
        <Link href={currentUser ? "/reservation" : "signin"} className="pb-10">
          予約ページへ
        </Link>
        {useContext(AuthContext).isStuff ? (
          <Link href="/admin" className="pb-10">
            スタッフページへ
          </Link>
        ) : (
          <></>
        )}
      </main>
      {loading ? <Loading /> : <></>}
    </>
  );
}
