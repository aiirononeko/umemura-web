"use client";

import "dayjs/locale/ja";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type AvailableTime,
  addDocument,
  Reservation,
} from "../../../firebase/service/collection";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Container, Title, Center, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Loading } from "../../../firebase/service/loading";
import { Timestamp } from "firebase/firestore";

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

  return (
    <Container className="m-auto " size="xs">
      <Center>
        <Title className="mb-12">オフライン予約登録</Title>
      </Center>
      <form
        onSubmit={form.onSubmit((values) => {
          setLoading(true);
          addDocument(
            {
              customerId: "",
              stuffId: "",
              course: "",
              date: values.date,
              startTime: values.startTime,
              endTime: values.endTime,
            } as Reservation,
            "reservations"
          ).then(() => {
            setLoading(false);
            alert("登録が完了しました。");
          });
        })}
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
          <Center>
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
      {loading ? <Loading /> : <></>}
    </Container>
  );
}
