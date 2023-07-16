"use client";

import { Button, Center, Container, Grid, Title } from "@mantine/core";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../firebase/service/authContext";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  const { user } = useContext(AuthContext);
  if (!user) {
    router.push("signin");
  }

  return (
    <Container className="m-auto">
      <Center>
        <Title className="mb-12">管理者画面</Title>
      </Center>
      <Grid gutter="xl">
        <Grid.Col className="text-center">
          <Button
            component={Link}
            href="/admin/reservation"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64"
          >
            予約を管理する
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button
            component={Link}
            href="/admin/availableTime"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64"
          >
            予約可能日時を管理する
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button
            component={Link}
            href="/admin/reservation/offline"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64"
          >
            オフラインの予約を管理する
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button
            component={Link}
            href="/admin/stuff/profile"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64"
          >
            プロフィールを管理する
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button
            component={Link}
            href="/admin/course"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64"
          >
            コースを管理する
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button
            component={Link}
            href="/admin/stuff"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64"
          >
            スタッフを管理する
          </Button>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
