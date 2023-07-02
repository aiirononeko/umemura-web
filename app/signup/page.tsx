"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, Container, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../_common/loading";
import { type Customer } from "../_common/collection";
import { registerAuthenticate } from "../_common/authentication";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
    } as Customer,
    validate: {
      name: (value) => (value.length < 1 ? "名前を入力してください" : null),
      email: (value) =>
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
          ? null
          : "メールアドレスを正しく入力してください",
      phoneNumber: (value) =>
        /^0[789]0-[0-9]{4}-[0-9]{4}$/.test(value)
          ? null
          : "電話番号はxxx-yyyy-zzzzのフォーマットで入力してください",
      password: (value) =>
        value.length < 6 ? "パスワードは6文字以上で入力してください" : null,
    },
  });

  return (
    <Container className="m-auto">
      <form
        onSubmit={form.onSubmit((values) => {
          registerAuthenticate(
            values,
            "customers",
            setLoading,
            router,
            "/",
            true
          );
        })}
      >
        <TextInput
          label="名前"
          placeholder="テスト太郎"
          required
          {...form.getInputProps("name")}
          mb="lg"
        />
        <TextInput
          label="メールアドレス"
          placeholder="testtaro@example.com"
          required
          {...form.getInputProps("email")}
          mb="lg"
        />
        <TextInput
          label="電話番号"
          placeholder="000-1111-2222"
          required
          {...form.getInputProps("phoneNumber")}
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
              新規登録
            </Button>
          </Center>
        </div>
      </form>
      {loading ? <Loading /> : <></>}
    </Container>
  );
}
