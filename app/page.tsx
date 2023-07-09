"use client";

import Link from "next/link";
import {
  Button,
  Center,
  Container,
  Modal,
  TextInput,
  Title,
  BackgroundImage,
  Box,
  Text,
  Image,
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
      <Container className="m-auto">
        <Center p="md">
          <div
            style={{
              margin: "0 0 40px",
              position: "relative",
            }}
          >
            <video
              src="https://t.pimg.jp/mp4/098/530/329/1/98530329.mp4"
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "460px",
                maxHeight: "460px",
                background: "#333",
                borderRadius: "16px",
                objectFit: "cover",
              }}
            ></video>
            <div
              style={{
                position: "absolute",
                display: "inline-block",
                width: "100%",
                height: "calc(100% - 8px)",
                background: "rgba(0, 0, 0, 0.21)",
                top: "0",
                left: "0",
                borderRadius: "16px",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "calc(0px + 5px)", // 5pxはボタンのbox-shadowの分
                padding: "24px",
                width: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <div
                style={{
                  margin: "0 0 24px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "18px",
                    lineHeight: "1.5",
                    flex: "0 0 auto",
                  }}
                >
                  なりたいを叶えたら、
                  <br />
                  もっと好きになる。
                </h3>
                <h2
                  style={{
                    color: "#fff",
                    fontSize: "24px",
                    lineHeight: "1.5",
                    flex: "0 0 auto",
                  }}
                >
                  Holistic Beauty Salon
                  <br />
                  Lu Miijou
                </h2>
              </div>
            </div>
          </div>
        </Center>
        <Link href={currentUser ? "/reservation" : "signin"} className="pb-10">
          予約ページへ
        </Link>
      </Container>
      {loading ? <Loading /> : <></>}
    </>
  );
}
