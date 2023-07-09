"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { Reservation, getDocuments, Customer, Stuff } from "@/app/firebase/service/collection";
import { AuthContext } from "@/app/firebase/service/authContext";
import { Timestamp } from "firebase/firestore";
import { Button, Center, Container, Modal, Table, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";

const ReservationDetail = (props: { reservation: Reservation, customers: Customer[] }) => {
  const { reservation, customers } = props;
  const customer = customers.find(c => c.id === reservation.customerId);

  return (
    <>
      <Center>
        <Title>
          予約詳細
        </Title>
      </Center>
      <h5>日時</h5>
      <h1>{`${reservation.startTime}~${reservation.endTime}`}</h1>
      <h5>コース名</h5>
      <h1>{reservation.course}</h1>
      <h5>お客様名</h5>
      <h1>{`${customer?.lastName} ${customer?.firstName}`}</h1>
      <h5>電話番号</h5>
      <h1>{customer?.phoneNumber}</h1>
    </>
  )
}

export default function Top() {
  const uid = useContext(AuthContext).user?.uid;
  const [originReservations, setOriginReservations] = useState<Reservation[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [targetDate, setTargetDate] = useState(Timestamp.fromDate(new Date()));
  const [opened, { open, close }] = useDisclosure(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    (async () => {
      if (uid != undefined) {
        const reservationDocuments = await getDocuments("reservations") as Reservation[];
        const filteredReservations = reservationDocuments.filter((r) => {
          return r.stuffId === uid;
        });
        const targetCustomerIds = filteredReservations.map(doc => doc.customerId);
        const customerDocuments = await getDocuments("customers") as Customer[]
        const filteredCustomers = customerDocuments.filter(customer => targetCustomerIds.includes(customer.id));
        setCustomers(filteredCustomers);
        setOriginReservations(filteredReservations);
        setReservations(filteredReservations.filter(r => {
          const date = r.date.toDate();
          const tDate = targetDate.toDate();
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return year === tDate.getFullYear() && month === tDate.getMonth() + 1 && day === tDate.getDate();
        }).sort((a, b) => {
          if (a.startTime < b.startTime) {
            return -1;
          } else if (a.startTime > b.startTime) {
            return 1;
          } else {
            return 0;
        }}))
      }})();
  }, [uid]);

  useEffect(() => {
    const filteredDocuments = originReservations.filter(r => {
      const date = r.date.toDate();
      const tDate = targetDate.toDate();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return year === tDate.getFullYear() && month === tDate.getMonth() + 1 && day === tDate.getDate();
    }).sort((a, b) => {
      if (a.startTime < b.startTime) {
        return -1;
      } else if (a.startTime > b.startTime) {
        return 1;
      } else {
        return 0;
      }
    });
    setReservations(filteredDocuments);
  }, [targetDate]);

  return (
    <Container>
      <Modal opened={opened} onClose={close} size="xs">
        <ReservationDetail reservation={reservations.at(num)!} customers={customers} />
      </Modal>
      <Center mb="lg">
        <Title>
          予約管理日時
        </Title>
      </Center>
      <Center mb="lg">
        <Button
          component={Link}
          href="/admin/availableTime"
          className="mt-4"
        >
          予約可能日時を登録
        </Button>
      </Center>
      <Center>
        <DatePicker
          value={targetDate.toDate()}
          onChange={e => setTargetDate(Timestamp.fromDate(e!))}
          placeholder="Select date"
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
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <>
              <tr
                key={index}
                onClick={() => {
                  setNum(index);
                  open();
                }}
              >
                <td>{`${reservation.startTime}~${reservation.endTime}`}</td>
                <td>{reservation.course}</td>
              </tr>
            </>
          ))}
        </tbody>
      </Table>
      <Center mt="xl">
        <Button
          component={Link}
          href="/admin"
        >
          戻る
        </Button>
      </Center>
    </Container>
  );
}
