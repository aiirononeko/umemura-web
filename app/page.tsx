"use client";

import Link from "next/link";
import {
  Button,
  Center,
  Container,
  Modal,
  TextInput,
  Title,
  Box,
  Text,
  Divider,
  TypographyStylesProvider,
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
              position: "relative",
              marginBottom: "10px",
            }}
          >
            <video
              src="/top.mp4"
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
                height: "calc(100%)",
                background: "rgba(0, 0, 0, 0.21)",
                top: "0",
                left: "0",
                borderRadius: "16px",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "0px", // 5pxはボタンのbox-shadowの分
                padding: "24px",
                width: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <div
                style={{
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
        <Center>
          <Link href={currentUser ? "/reservation" : "signin"}>
            <Button variant="outline" color="teal" radius="xl" size="lg">
              オンラインで予約する
            </Button>
          </Link>
        </Center>
        <Center mb={20}>
          <TypographyStylesProvider>
            <h3>
              歴16年累計施術10000人以上。全国のエステティシャンを指導する講師がいるサロンでなりたい自分を叶えよう
            </h3>
            <p>
              肩こりや腰痛、頭痛など日々の体の不調は、背骨や骨盤の歪みが根本的な原因と言われています。《ル・ミージュ》では様々な年代毎の悩みに対応し、ただ美しくなるだけでなく骨格の歪みを整え、身体の内側と外側の両方をケアし、健康美をお造りします。もう歳だから…と諦めないで!!ぜひ一度お越しくださいませ。
            </p>
          </TypographyStylesProvider>
        </Center>
        <Center>
          <Box
            sx={(theme) => ({
              textAlign: "center",
              padding: theme.spacing.xl,
              borderRadius: theme.radius.md,
              border: "solid teal 0.5px",
              width: "100%",
            })}
          >
            <Text align="left" mb={12} size={18} weight="bolder">
              サロン情報
            </Text>
            <Divider color="teal" mb={16} />
            <Text align="left" mb={12}>
              電話番号: 0573-66-5930
            </Text>
            <Text align="left" mb={12}>
              住所: 岐阜県中津川市淀川町3-20 昂21F
            </Text>
            <Text align="left" mb={12}>
              アクセス:
              JR中津川駅を出て中津川駅前の信号を越えてしばらく直進。新町の信号を越えた所左側に当サロンがあります。ルビットタウン手前のマンション1F、食事処伊吹さんの奥です。ルビットタウンバス停側出口から徒歩30秒です。マンションの入り口ではなく、テナント側にお越しください。※施術中お電話出られないこともございます。折り返します。{" "}
            </Text>
            <Text align="left" mb={12}>
              営業時間: 10:00 ~ 20:00 (最終受付19:00)
              <br />
              ※時間外は応相談
            </Text>
            <Text align="left" mb={12}>
              定休日: 不定休
            </Text>
            <Text align="left">駐車場: あり</Text>
          </Box>
        </Center>
        <Center mt={20} mb={30}>
          <Link href={currentUser ? "/reservation" : "signin"}>
            <Button variant="outline" color="teal" radius="xl" size="lg">
              オンラインで予約する
            </Button>
          </Link>
        </Center>
      </Container>
      {loading ? <Loading /> : <></>}
    </>
  );
}
