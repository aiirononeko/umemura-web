'use client';

import { Button, Center, Container, Grid, Title } from "@mantine/core";
import Link from "next/link";

export default function Admin() {
  return (
    <Container className="m-auto">
      <Center>
        <Title className="mb-12">管理者画面</Title>
      </Center>
      <Grid gutter="xl">
        <Grid.Col className="text-center">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64">
            <Link href="/admin/reservation">
              予約を管理する
            </Link>
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64">
            <Link href="/admin/availableTime">
              予約可能日時を管理する
            </Link>
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64">
            <Link href="/admin/course">
              コースを管理する
            </Link>
          </Button>
        </Grid.Col>
        <Grid.Col className="text-center">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-64">
            <Link href="/admin/stuff">
              スタッフを管理する
            </Link>
          </Button>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
