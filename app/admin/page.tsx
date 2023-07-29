"use client";

import { useState, useEffect, useContext } from "react";
import { Reservation } from "@/app/firebase/service/collection";
import { AuthContext } from "@/app/firebase/service/authContext";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  Button,
  Center,
  Group,
  Modal,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { db } from "../firebase/config";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

export default function Top() {
  const uid = useContext(AuthContext).user?.uid;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
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
      date: targetDate,
      startTime: "",
      endTime: "",
    } as Reservation,
  });

  const [opened, { open, close }] = useDisclosure();

  useEffect(() => {
    if (uid) {
      const fetchReservations = async () => {
        try {
          const _day = new Date();
          const q = query(
            collection(db, "reservations"),
            where("stuffId", "==", uid),
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
          setReservations(documents as Reservation[]);
        } catch (e) {
          console.error("Error adding document: ", e);
          return [];
        }
      };
      fetchReservations();
    }
  }, [uid]);

  useEffect(() => {
    const filteredDocuments = reservations
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
    setFilteredReservations(filteredDocuments);
  }, [targetDate, reservations]);

  const updateReservation = async (reservation: Reservation): Promise<void> => {
    try {
      if (uid) {
        const docRef = doc(db, "reservations", reservation.id);
        await setDoc(
          docRef,
          {
            ...reservation,
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteReservation = async (id: string): Promise<void> => {
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
        <Title>予約一覧</Title>
      </Center>
      <Center>
        <DateInput
          valueFormat="YYYY/MM/DD"
          value={targetDate.toDate()}
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
            <th>日時</th>
            <th>コース名</th>
            <th>お客様氏名</th>
            <th>電話番号</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation, index) => (
            <>
              <tr key={index}>
                <td>{`${reservation.startTime}~${reservation.endTime}`}</td>
                <td>{reservation.course}</td>
                <td>{reservation.customerName}</td>
                <td>{reservation.customerPhoneNumber}</td>
                <td
                  onClick={(): void => {
                    form.setFieldValue("id", reservation.id);
                    form.setValues(reservation);
                    open();
                  }}
                >
                  編集
                </td>
                <td
                  onClick={(): void => {
                    const result = window.confirm("削除しますか？");
                    if (result) {
                      deleteReservation(reservation.id);
                    }
                  }}
                >
                  削除
                </td>{" "}
              </tr>
            </>
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
            await updateReservation({
              ...value,
            });
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
          <TextInput
            label="コース名"
            placeholder="ホニャホニャコース"
            required
            {...form.getInputProps("course")}
            mb="lg"
          />
          <TextInput
            label="お客様氏名"
            placeholder="予約 太郎"
            required
            {...form.getInputProps("customerName")}
            mb="lg"
          />
          <TextInput
            label="電話番号"
            placeholder="080-0808-0808"
            required
            {...form.getInputProps("customerPhoneNumber")}
            mb="lg"
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
    </>
  );
}
