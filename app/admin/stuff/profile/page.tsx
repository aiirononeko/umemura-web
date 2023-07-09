"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Center,
  Group,
  Title,
  Textarea,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../../../firebase/service/loading";
import { AuthContext } from "@/app/firebase/service/authContext";
import { updateStuff } from "@/app/firebase/service/collection";

interface FormValue {
  profile: string,
  profileImage: File | undefined,
}

export default function StuffProfile() {
  const router = useRouter();
  const form = useForm<FormValue>({
    initialValues: {
      profile: "",
      profileImage: undefined,
    },
  });
  const uid = useContext(AuthContext).user?.uid;
  const [loading, setLoading] = useState(false);

  return (
    <Container className="m-auto " size="xs">
      <Center>
        <Title className="mb-12">プロフィール設定</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) => {
          const imgName = values.profileImage ? uid + "." + values.profileImage.type.replace("image/", "") : undefined;
          updateStuff(
            values.profile,
            setLoading,
            uid ?? "",
            router,
            "/admin/stuff",
            values.profileImage,
            imgName,
          );
        })}
      >
        <FileInput
          label="プロフィール画像"
          accept="image/*"
          placeholder="プロフィール画像"
          required
          {...form.getInputProps("profileImage")}
          mb="lg"
        />
        <Textarea
          size="xs"
          label="プロフィール"
          placeholder="更新しない場合は空欄にしてください"
          {...form.getInputProps("profile")}
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
