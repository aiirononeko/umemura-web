"use client";

import Link from "next/link";
import { useState } from "react";
import { Container, Stepper, Button, Group } from "@mantine/core";

export default function Reservation() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [staffs, setStaffs] = useState([]);

  return (
    <>
      <Container className="m-auto">
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step
            label="First step"
            description="スタッフを選択してください"
          >
            スタッフ選択画面
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="コースを選択してください"
          >
            コース選択画面
          </Stepper.Step>
          <Stepper.Step
            label="Final step"
            description="日にちを選択してください"
          >
            日にち選択画面
          </Stepper.Step>
          <Stepper.Completed>
            予約が完了しました！ マイページから予約の確認ができます。
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            戻る
          </Button>
          <Button onClick={nextStep}>進む</Button>
        </Group>
        <Link href="/">トップページへ</Link>
      </Container>
    </>
  );
}
