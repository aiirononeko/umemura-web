"use client";

import "dayjs/locale/ja";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type AvailableTime,
  addSubCollectionDocument,
  getDocuments,
} from "../../firebase/service/collection";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Container, Title, Center, Button, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../../firebase/service/loading";
import { getUid } from "@/app/firebase/service/authentication";
import { Timestamp } from "firebase/firestore";
import { getSubcollectionDocuments } from "../../firebase/service/collection";

export default function AvailableTimeRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      date: Timestamp.fromDate(new Date()),
      startTime: "",
      endTime: "",
    } as AvailableTime,
  });
  const uid = getUid();

  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  useEffect(() => {
    const data = async () => {
      const availableTimes = await getSubcollectionDocuments(
        "stuffs",
        uid ?? "",
        "available_times"
      );
      setAvailableTimes(availableTimes as AvailableTime[]);
    };
    data();
  }, [uid]);

  return (
    <Container className="m-auto " size="xs">
      <Center>
        <Title className="mb-12">予約可能日時登録</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) =>
          addSubCollectionDocument(
            values,
            "stuffs",
            uid ?? "",
            "available_times",
            setLoading,
            router,
            "admin/availableTime"
          )
        )}
      >
        <Group position="center">
          <DatePicker
            firstDayOfWeek={0}
            locale="ja"
            placeholder="日付を選択"
            {...form.getInputProps("date")}
          />
        </Group>
        <TimeInput
          label="開始時刻"
          size="md"
          withAsterisk
          {...form.getInputProps("startTime")}
        />
        <TimeInput
          label="終了時刻"
          size="md"
          withAsterisk
          {...form.getInputProps("endTime")}
        />
        <div className="pt-4">
          <Center mb={30}>
            <Group>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
              >
                登録
              </Button>
              <Button
                component={Link}
                href="/admin"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold"
              >
                戻る
              </Button>
            </Group>
          </Center>
        </div>
      </form>
      <Center>
        <Text>登録した予約可能日時一覧</Text>
      </Center>
      <Center>
        <ul>
          {availableTimes.map((availableTime) => (
            <li key={availableTime.id}>
              {availableTime.date.toDate().toLocaleDateString()}{" "}
              {availableTime.startTime}~{availableTime.endTime}
            </li>
          ))}
        </ul>
      </Center>
      {loading ? <Loading /> : <></>}
    </Container>
  );
}
