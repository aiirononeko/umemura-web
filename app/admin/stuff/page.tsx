"use client";

import Link from "next/link";
import { useState } from "react";
import { type Stuff, setDocuments } from "@/app/firebase/service/collection";
import { Center, Container, Table, Title } from "@mantine/core";

const rows: Stuff[] = [
  {
    firstName: "太郎",
    lastName: "佐藤",
    gender: "男性",
    profile: "全力で頑張ります",
    email: "taro@example.com",
    password: "password",
  },
  {
    firstName: "太郎",
    lastName: "佐藤",
    gender: "男性",
    profile: "全力で頑張ります全力で頑張ります全力で頑張ります全力で頑張ります全力で頑張ります全力で頑張ります全力で頑張ります",
    email: "taro@example.com",
    password: "password",
  },
  {
    firstName: "太郎",
    lastName: "佐藤",
    gender: "男性",
    profile: "全力で頑張ります",
    email: "taro@example.com",
    password: "password",
  },
  {
    firstName: "太郎",
    lastName: "佐藤",
    gender: "男性",
    profile: "全力で頑張ります",
    email: "taro@example.com",
    password: "password",
  },
  {
    firstName: "太郎",
    lastName: "佐藤",
    gender: "男性",
    profile: "全力で頑張ります",
    email: "taro@example.com",
    password: "password",
  },
]

export default function Top() {
  const [stuffs, setStuffs] = useState<Stuff[]>([]);
  setDocuments('stuffs', setStuffs)

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
          {rows.map((stuff: Stuff, index) => (
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
