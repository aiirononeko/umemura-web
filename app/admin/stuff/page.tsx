"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type Stuff, getDocuments } from "@/app/firebase/service/collection";
import { Center, Container, Table, Title } from "@mantine/core";

export default function Top() {
  const [stuffs, setStuffs] = useState<Stuff[]>([]);

  useEffect(()=> {
    getDocuments("stuffs").then((res) => {
      setStuffs(res as Stuff[]);
    });
  }, []);

  return (
    <Container className="m-auto">
      <Center>
        <Title className="mb-12">スタッフ管理ページ</Title>
      </Center>
      <Center>
        <Link href="/admin/stuff/register" className="pb-5">
          スタッフ登録
        </Link>
      </Center>
      <Table
        className="whitespace-nowrap"
        verticalSpacing="xl"
        striped
        withBorder
        withColumnBorders
      >
        <thead>
          <tr>
            <th>スタッフ名</th>
            <th>性別</th>
            <th>プロフィール</th>
          </tr>
        </thead>
        <tbody>
          {stuffs.map((stuff: Stuff, index) => (
            <tr key={index}>
              <td>{`${stuff.lastName} ${stuff.firstName}`}</td>
              <td>{stuff.gender}</td>
              <td style={{ maxWidth: "40vw" }} className="truncate">
                {stuff.profile}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Center className="mt-12">
        <Link href="/admin">管理者画面ページ</Link>
      </Center>
    </Container>
  );
}
