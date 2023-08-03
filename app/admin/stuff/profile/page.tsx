"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Center,
  Group,
  Title,
  Textarea,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../../../firebase/service/loading";
import { AuthContext } from "@/app/firebase/service/authContext";
import { Stuff, updateStuff } from "@/app/firebase/service/collection";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

interface FormValue {
  profile: string;
  profileImage: File | undefined;
}

export default function StuffProfile() {
  const router = useRouter();
  const uid = useContext(AuthContext).user?.uid;

  const [stuff, setStuff] = useState<Stuff | null>(null);

  useEffect(() => {
    if (uid) {
      const fetchStuff = async () => {
        try {
          const docRef = await getDoc(doc(db, "stuffs", uid));
          const document = docRef.data();
          setStuff(document as Stuff);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      };
      fetchStuff();
    }
  }, [uid]);

  const form = useForm<FormValue>({
    initialValues: {
      profile: stuff?.profile ?? "",
      profileImage: undefined,
    },
  });
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Center>
        <Title mb={30}>プロフィール設定</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) => {
          const imgName = values.profileImage
            ? uid + "." + values.profileImage.type.replace("image/", "")
            : undefined;
          updateStuff(
            values.profile,
            setLoading,
            uid ?? "",
            router,
            "/admin/stuff",
            values.profileImage,
            imgName
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
          placeholder="よろしくお願いします！"
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
          </Group>
        </Center>
      </form>
      {loading ? <Loading /> : <></>}
    </>
  );
}
