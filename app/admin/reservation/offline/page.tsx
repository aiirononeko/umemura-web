"use client";

import "dayjs/locale/ja";
import { useState, useEffect, useContext } from "react";
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
import { Reservation } from "@/app/firebase/service/collection";

export default function OfflineReservationRegister() {
  const uid = useContext(AuthContext).user?.uid;

  const [offlineReservations, setOfflineReservations] = useState<Reservation[]>(
    []
  );
  const [filteredOfflineReservatios, setFilteredOfflineReservations] = useState<
    Reservation[]
  >([]);

  const [targetDate, setTargetDate] = useState(Timestamp.fromDate(new Date()));

  const form = useForm({
    initialValues: {
      id: "",
      customerName: "",
      customerPhoneNumber: "",
      customerEmail: "",
      stuffId: "",
      course: "",
      date: Timestamp.fromDate(new Date()),
      startTime: "",
      endTime: "",
    } as Reservation,
  });

  const [opened, { open, close }] = useDisclosure();

  const [targetOfflineReservation, setTargetOfflineReservation] =
    useState<Reservation | null>(null);

  useEffect(() => {
    if (uid) {
      const fetchOfflineReservation = async () => {
        try {
          const _day = new Date();
          // 当日の0時以降のオフライン予約を取得
          const q = query(
            collection(db, "reservations"),
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
            ),
            where("stuffId", "==", "")
          );
          const docRef = await getDocs(q);
          const documents = docRef.docs.map((doc) => doc.data());
          setOfflineReservations(documents as Reservation[]);
        } catch (e) {
          console.error("Error adding document: ", e);
          return [];
        }
      };
      fetchOfflineReservation();
    }
  }, [uid]);

  useEffect(() => {
    const filteredDocuments = offlineReservations
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
    setFilteredOfflineReservations(filteredDocuments);
  }, [targetDate, offlineReservations]);

  const addOfflineReservation = async (
    offlineReservation: Reservation
  ): Promise<void> => {
    try {
      if (uid) {
        offlineReservation.date = targetDate;

        const docRef = collection(db, "reservations");
        const result = await addDoc(docRef, {
          ...offlineReservation,
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

  const updateOfflineReservation = async (
    offlineReservation: Reservation
  ): Promise<void> => {
    try {
      if (uid) {
        const docRef = doc(db, "reservations", offlineReservation.id);
        await setDoc(
          docRef,
          {
            ...offlineReservation,
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteOfflineReservation = async (id: string): Promise<void> => {
    try {
      if (uid) {
        const docRef = doc(db, "reservations", id);
        deleteDoc(docRef);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <Center mb="lg">
        <Title>オフライン予約一覧</Title>
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
          {filteredOfflineReservatios.map((offlineReservation, index) => (
            <tr key={index}>
              <td>{offlineReservation.startTime}</td>
              <td>{offlineReservation.endTime}</td>
              <td
                onClick={(): void => {
                  setTargetOfflineReservation(offlineReservation);
                  form.setValues(offlineReservation);
                  open();
                }}
              >
                編集
              </td>
              <td
                onClick={(): void => {
                  const result = window.confirm("削除しますか？");
                  if (result) {
                    deleteOfflineReservation(offlineReservation.id);
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
            if (targetOfflineReservation) {
              await updateOfflineReservation({
                ...targetOfflineReservation,
                ...value,
              });
              setTargetOfflineReservation(null);
            } else {
              await addOfflineReservation(value);
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
