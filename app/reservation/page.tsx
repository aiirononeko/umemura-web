"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Container,
  Stepper,
  Button,
  Group,
  Card,
  Image,
  Text,
  Grid,
} from "@mantine/core";
import {
  AvailableTime,
  Course,
  Reservation,
  Stuff,
  getDocuments,
  getSubcollectionDocuments,
} from "../firebase/service/collection";

export default function Reservation() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [stuffs, setStuffs] = useState<Stuff[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  const [selectedStuff, setSelectedStuff] = useState<Stuff>();
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [selectedAvailableTime, setSelectedAvailableTime] =
    useState<AvailableTime>();
  const [reservation, setReservation] = useState<Reservation>();

  useEffect(() => {
    getDocuments("stuffs").then((res) => {
      setStuffs(res as Stuff[]);
    });
  }, []);

  return (
    <>
      <Container className="m-auto">
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step
            label="First step"
            description="スタッフを選択してください"
          >
            {stuffs.map((stuff) => (
              <div key={`${stuff.firstName}_${stuff.lastName}`}>
                <Grid className="mt-5">
                  <Grid.Col>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Image
                          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                          height={160}
                          alt="Norway"
                        />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text
                          weight={500}
                        >{`${stuff.firstName} ${stuff.lastName}`}</Text>
                      </Group>

                      <Text size="sm" color="dimmed">
                        {stuff.profile}
                      </Text>

                      <Button
                        variant="light"
                        color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                        onClick={() => {
                          setSelectedStuff(stuff);
                          getSubcollectionDocuments(
                            "stuffs",
                            stuff.id,
                            "courses"
                          ).then((res) => {
                            setCourses(res as Course[]);
                          });
                          nextStep();
                        }}
                      >
                        このスタッフを選択する
                      </Button>
                    </Card>
                  </Grid.Col>
                </Grid>
              </div>
            ))}
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="コースを選択してください"
          >
            {courses.map((course) => (
              <div key={`${course.title}`}>
                <Grid className="mt-5">
                  <Grid.Col>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Image
                          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                          height={160}
                          alt="Norway"
                        />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>{course.title}</Text>
                      </Group>

                      <Text size="sm" color="dimmed">
                        {course.description}
                      </Text>

                      <Button
                        variant="light"
                        color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                        onClick={() => {
                          setSelectedCourse(course);
                          getSubcollectionDocuments(
                            "stuffs",
                            selectedStuff?.id ?? "",
                            "availableTimes"
                          ).then((res) => {
                            setAvailableTimes(res as AvailableTime[]);
                          });
                          nextStep();
                        }}
                      >
                        このコースを選択する
                      </Button>
                    </Card>
                  </Grid.Col>
                </Grid>
              </div>
            ))}
          </Stepper.Step>
          <Stepper.Step
            label="Third step"
            description="日にちを選択してください"
          >
            日にち選択画面
          </Stepper.Step>
          <Stepper.Step
            label="Final step"
            description="予約内容を確認してください"
          >
            予約確認画面
          </Stepper.Step>
          <Stepper.Completed>
            予約が完了しました！ マイページから予約の確認ができます。
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            一つ前に戻る
          </Button>
        </Group>
        <Link href="/">トップページへ</Link>
      </Container>
    </>
  );
}
