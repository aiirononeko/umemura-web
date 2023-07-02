"use client";

import { useState } from "react";
import { TextInput, Button, Container, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../_common/loading";
import { authenticate } from "../_common/authentication";
import { useRouter } from "next/navigation";

interface Parameter {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    } as Parameter,
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
    <>
      <Container className="m-auto">
        <form
          onSubmit={form.onSubmit((values) => {
            authenticate(
              values.email,
              values.password,
              setLoading,
              router,
              "/"
            );
          })}
        >
          <TextInput
            label="メールアドレス"
            placeholder="メールアドレス"
            required
            {...form.getInputProps("email")}
            mb="lg"
          />
          <TextInput
            label="パスワード"
            placeholder="パスワード"
            required
            type="password"
            {...form.getInputProps("password")}
          />
          <div className="pt-4">
            <Center>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
              >
                ログイン
              </Button>
            </Center>
          </div>
        </form>
        {loading ? <Loading /> : <></>}
      </Container>
    </>
  );
}
