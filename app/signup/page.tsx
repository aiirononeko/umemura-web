"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, Container, Center, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../firebase/service/loading";
import { registerAuthenticate } from "../firebase/service/authentication";
import { Customer } from "../firebase/service/collection";

function builderCustomer(values: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}): Customer {
  return {
    id: "",
    firstName: values.firstName,
    lastName: values.lastName,
    phoneNumber: values.phoneNumber,
    email: values.email,
  };
}


export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
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
    <Container className="m-auto">
      <form
        onSubmit={form.onSubmit((values) => {
          registerAuthenticate(
            builderCustomer(values),
            "customers",
            values.password,
            setLoading,
            router,
            "/"
          );
        })}
      >
        <Group grow>
          <TextInput
            label="姓"
            placeholder="梅村"
            required
          {...form.getInputProps("lastName")}
            mb="lg"
          />
          <TextInput
            label="名"
            placeholder="祐貴"
            required
            {...form.getInputProps("firstName")}
            mb="lg"
          />
        </Group>
        <TextInput
          label="メールアドレス"
          placeholder="taro@example.com"
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
          placeholder="6文字以上で入力してください"
          required
          type="password"
          {...form.getInputProps("password")}
        />
        <Center>
          <Button
            type="submit"
            mt="lg"
          >
            新規登録
          </Button>
        </Center>
      </form>
      {loading ? <Loading /> : <></>}
    </Container>
  );
}
