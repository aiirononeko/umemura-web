"use client";

import "dayjs/locale/ja";
import { useState, useEffect, useContext } from "react";
import { type AvailableTime } from "../../firebase/service/collection";
import { DateInput, TimeInput } from "@mantine/dates";
import {
  Title,
  Center,
  Button,
  Group,
  Text,
  Table,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "@/app/firebase/service/authContext";
import { db } from "@/app/firebase/config";
import { useDisclosure } from "@mantine/hooks";

export default function AvailableTimeRegister() {
  const uid = useContext(AuthContext).user?.uid;

  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [filteredAvailableTimes, setFilteredAvailableTimes] = useState<
    AvailableTime[]
  >([]);

  const [targetDate, setTargetDate] = useState(Timestamp.fromDate(new Date()));

  const form = useForm({
    initialValues: {
      date: targetDate,
      startTime: "",
      endTime: "",
    } as AvailableTime,
  });

  const [opened, { open, close }] = useDisclosure();

  const [targetAvailableTime, setTargetAvailableTime] =
    useState<AvailableTime | null>(null);

  useEffect(() => {
    if (uid) {
      const fetchAvailableTimes = async () => {
        try {
          const _day = new Date();
          // 当日の0時以降の予約可能日時を取得
          const q = query(
            collection(db, "stuffs", uid, "available_times"),
            where(
              "date",
              ">=",
              Timestamp.fromDate(
                new Date(
                  _day.getFullYear(),
                  _day.getMonth(),
                  _day.getDate(),
                  0,
                  0,
                  0
                )
              )
            )
          );
          const docRef = await getDocs(q);
          const documents = docRef.docs.map((doc) => doc.data());
          setAvailableTimes(documents as AvailableTime[]);
        } catch (e) {
          console.error("Error adding document: ", e);
          return [];
        }
      };
      fetchAvailableTimes();
    }
  }, [uid]);

  useEffect(() => {
    const filteredDocuments = availableTimes
      .filter((r) => {
        const date = r.date.toDate();
        const tDate = targetDate.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return (
          year === tDate.getFullYear() &&
          month === tDate.getMonth() + 1 &&
          day === tDate.getDate()
        );
      })
      .sort((a, b) => {
        if (a.startTime < b.startTime) {
          return -1;
        } else if (a.startTime > b.startTime) {
          return 1;
        } else {
          return 0;
        }
      });
    setFilteredAvailableTimes(filteredDocuments);
  }, [targetDate, availableTimes]);

  const addAvailableTime = async (
    availableTime: AvailableTime
  ): Promise<void> => {
    try {
      if (uid) {
        const docRef = collection(db, "stuffs", uid, "available_times");
        const result = await addDoc(docRef, {
          ...availableTime,
        });
        await setDoc(
          result,
          {
            id: result.id,
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateAvailableTime = async (
    availableTime: AvailableTime
  ): Promise<void> => {
    try {
      if (uid) {
        const docRef = doc(
          db,
          "stuffs",
          uid,
          "available_times",
          availableTime.id
        );
        await setDoc(
          docRef,
          {
            ...availableTime,
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteAvailableTime = async (id: string): Promise<void> => {
    try {
      if (uid) {
        const docRef = doc(db, "stuffs", uid, "available_times", id);
        deleteDoc(docRef);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <Center mb="lg">
        <Title>予約可能日時一覧</Title>
      </Center>
      <Center>
        <DateInput
          valueFormat="YYYY/MM/DD"
          defaultValue={targetDate.toDate()}
          onChange={(e) => setTargetDate(Timestamp.fromDate(e!))}
          placeholder="Select date"
          styles={{
            weekday: {
              fontSize: 18,
            },
          }}
        />
      </Center>
      <Table
        className="whitespace-nowrap"
        verticalSpacing="xl"
        striped
        withBorder
        withColumnBorders
        mt="xl"
      >
        <thead>
          <tr>
            <th>開始時刻</th>
            <th>終了時刻</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredAvailableTimes.map((availableTime, index) => (
            <tr key={index}>
              <td>{availableTime.startTime}</td>
              <td>{availableTime.endTime}</td>
              <td
                onClick={(): void => {
                  setTargetAvailableTime(availableTime);
                  form.setValues(availableTime);
                  open();
                }}
              >
                編集
              </td>
              <td
                onClick={(): void => {
                  const result = window.confirm("削除しますか？");
                  if (result) {
                    deleteAvailableTime(availableTime.id);
                  }
                }}
              >
                削除
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="予約可能日時登録"
        size="80%"
      >
        <form
          onSubmit={form.onSubmit(async (value) => {
            if (targetAvailableTime) {
              await updateAvailableTime({
                ...targetAvailableTime,
                ...value,
              });
              setTargetAvailableTime(null);
            } else {
              await addAvailableTime(value);
            }
            form.reset();
            close();
          })}
        >
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
              <Group mt={20}>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
                  color="green"
                >
                  登録
                </Button>
              </Group>
            </Center>
          </div>
        </form>
      </Modal>

      <Button
        w={50}
        h={50}
        radius={"50%"}
        color={"green"}
        onClick={open}
        style={{
          position: "fixed",
          bottom: "18%",
          right: "13%",
        }}
      >
        <Text size={"xl"}>+</Text>
      </Button>
    </>
  );
}
