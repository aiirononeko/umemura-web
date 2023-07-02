"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type Stuff, getDocuments } from "@/app/firebase/service/collection";
import { Button, Center, Container, Table, Title } from "@mantine/core";

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
        <Title>スタッフ管理</Title>
      </Center>
      <Center>
        <Button
          component={Link}
          href="/admin/stuff/register"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-4"
        >
          スタッフ登録
        </Button>
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
      <Center>
        <Button
          component={Link}
          href="/admin"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold my-4"
        >
          戻る
        </Button>
      </Center>
    </Container>
  );
}
