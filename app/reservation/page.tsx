"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { DatePicker, TimeInput } from "@mantine/dates";
import {
  AvailableTime,
  Course,
  Reservation,
  Stuff,
  addDocument,
  getDocuments,
  getSubcollectionDocuments,
} from "../firebase/service/collection";
import { format, addMinutes } from "date-fns";
import { getUid } from "../firebase/service/authentication";
import { Timestamp } from "firebase/firestore";
import { Loading } from "../firebase/service/loading";

export default function Reservation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uid = getUid();

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [stuffs, setStuffs] = useState<Stuff[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  const [targetDateAvailableTimes, setTargetDateAvailableTimes] = useState<
    AvailableTime[]
  >([]);
  const [targetDate, setTargetDate] = useState<Timestamp>();

  const [selectedStuff, setSelectedStuff] = useState<Stuff>();
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [selectedAvailableTime, setSelectedAvailableTime] =
    useState<AvailableTime>();

  const [startTime, setStartTime] = useState("");
  const calcEndTime = (courseTime: string, startTime: string): Date => {
    const today = new Date();
    today.setHours(Number(startTime.split(":")[0]));
    today.setMinutes(Number(startTime.split(":")[1]));
    return addMinutes(today, Number(courseTime));
  };

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
                            stuff.id ?? "",
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
                        onClick={async () => {
                          setSelectedCourse(course);
                          getSubcollectionDocuments(
                            "stuffs",
                            selectedStuff?.id ?? "",
                            "available_times"
                          ).then((res) => {
                            const data = res as AvailableTime[];
                            setAvailableTimes(data);

                            const today = new Date();
                            setTargetDateAvailableTimes(
                              data.filter(
                                (availableTime) =>
                                  availableTime.date.toDate().getFullYear() ===
                                    today.getFullYear() &&
                                  availableTime.date.toDate().getMonth() ===
                                    today.getMonth() &&
                                  availableTime.date.toDate().getDay() ===
                                    today.getDay()
                              )
                            );
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
            <Group position="center" mb="lg">
              <DatePicker
                firstDayOfWeek={0}
                locale="ja"
                placeholder="日付を選択"
                defaultDate={new Date()}
                defaultValue={new Date()}
                onChange={(date) => {
                  setTargetDate(Timestamp.fromDate(date ?? new Date()));
                  setTargetDateAvailableTimes(
                    availableTimes.filter(
                      (availableTime) =>
                        availableTime.date.toDate().getFullYear() ===
                          date?.getFullYear() &&
                        availableTime.date.toDate().getMonth() ===
                          date?.getMonth() &&
                        availableTime.date.toDate().getDay() === date?.getDay()
                    )
                  );
                }}
              />
            </Group>
            {targetDateAvailableTimes.length === 0 ? (
              <Text fz="md">予約可能な時間がありません</Text>
            ) : (
              <Text fz="md">予約可能な時間</Text>
            )}
            {targetDateAvailableTimes.map((availableTime) => (
              <div
                key={`${availableTime.date}_${availableTime.startTime}_${availableTime.endTime}`}
              >
                <Text fz="md">{`${availableTime.startTime} ~ ${availableTime.endTime}`}</Text>
                <TimeInput
                  label="開始時刻"
                  size="md"
                  onChange={(value) => {
                    setStartTime(value.target.value);
                  }}
                  defaultValue={availableTime.startTime}
                />
                <Text fz="md">{`終了時間は${format(
                  calcEndTime(
                    selectedCourse?.time ?? "",
                    startTime !== "" ? startTime : availableTime.startTime
                  ),
                  "HH:mm"
                )}です`}</Text>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() => {
                    availableTime.startTime =
                      startTime !== "" ? startTime : availableTime.startTime;
                    availableTime.endTime = format(
                      calcEndTime(
                        selectedCourse?.time ?? "",
                        startTime !== "" ? startTime : availableTime.startTime
                      ),
                      "HH:mm"
                    );
                    availableTime.date =
                      targetDate ?? Timestamp.fromDate(new Date());
                    setSelectedAvailableTime(availableTime);
                    nextStep();
                  }}
                >
                  この日時を選択する
                </Button>
              </div>
            ))}
          </Stepper.Step>
          <Stepper.Step
            label="Final step"
            description="予約内容を確認してください"
          >
            <p>{`指名スタッフ: ${selectedStuff?.lastName} ${selectedStuff?.firstName}`}</p>
            <p>{`コース: ${selectedCourse?.title}`}</p>
            <p>{`予約日時: ${format(
              selectedAvailableTime?.date.toDate() ?? new Date(),
              "yyyy/MM/dd"
            )} ${selectedAvailableTime?.startTime} ~ ${
              selectedAvailableTime?.endTime
            }`}</p>
            <p>{`お支払い金額: ${selectedCourse?.amount}円 (現地決済)`}</p>

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => {
                addDocument(
                  {
                    customerId: uid ?? "",
                    stuffId: selectedStuff?.id ?? "",
                    course: selectedCourse?.title ?? "",
                    date: selectedAvailableTime?.date ?? "",
                    startTime: selectedAvailableTime?.startTime,
                    endTime: selectedAvailableTime?.endTime,
                  } as Reservation,
                  "reservations",
                  setLoading,
                  router,
                  "/"
                );
              }}
            >
              この内容で予約する
            </Button>
          </Stepper.Step>
          <Stepper.Completed>
            予約が完了しました！ マイページから予約の確認ができます。
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            一つ前のステップに戻る
          </Button>
        </Group>
        {loading ? <Loading /> : <></>}
      </Container>
    </>
  );
}
