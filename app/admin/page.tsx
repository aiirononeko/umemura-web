"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { Reservation } from "@/app/firebase/service/collection";
import { AuthContext } from "@/app/firebase/service/authContext";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Button, Center, Container, Table, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { db } from "../firebase/config";

export default function Top() {
  const uid = useContext(AuthContext).user?.uid;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [targetDate, setTargetDate] = useState(Timestamp.fromDate(new Date()));

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
              </tr>
            </>
          ))}
        </tbody>
      </Table>
    </>
  );
}
