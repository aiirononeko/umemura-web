"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Center,
  Group,
  Title,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../../../firebase/service/loading";
import { Stuff, updateDocument } from "@/app/firebase/service/collection";
import { getUid } from "@/app/firebase/service/authentication";

export default function StuffProfile() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      profile: "",
    } as Stuff,
  });
  const [loading, setLoading] = useState(false);
  const uid = getUid();

  return (
    <Container className="m-auto " size="xs">
      <Center>
        <Title className="mb-12">プロフィール設定</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) => {
          updateDocument(
            values,
            "stuffs",
            uid ?? "",
            setLoading,
            router,
            "/admin/stuff"
          );
        })}
      >
        <Textarea
          size="xs"
          label="プロフィール"
          placeholder="プロフィール"
          required
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
