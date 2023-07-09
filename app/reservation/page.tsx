"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Customer,
  Reservation,
  Stuff,
  addDocument,
  deleteSubCollectionDocument,
  getDocument,
  getDocuments,
  getSubcollectionDocuments,
  updateSubCollectionDocument,
} from "../firebase/service/collection";
import { format, addMinutes, isWithinInterval } from "date-fns";
import { getUid } from "../firebase/service/authentication";
import { Timestamp } from "firebase/firestore";
import { Loading } from "../firebase/service/loading";
import { addSubCollectionDocument } from "../firebase/service/collection";
import sendMail from "./sendMail";

export default function Reservation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uid = getUid();
  const [customer, setCustomer] = useState<Customer>();

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
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

  const calcAvailableTime = async (
    availableTimes: AvailableTime[],
    reservation: Reservation,
    selectedStuffId: string
  ): Promise<boolean> => {
    availableTimes.forEach((availableTime) => {
      // reservationのstartTime ~ endTimeがavailableTimeのstartTime ~ endTimeの範囲外だったら終了
      const reservationStartTime = new Date();
      reservationStartTime.setHours(
        Number(reservation.startTime.split(":")[0])
      );
      reservationStartTime.setMinutes(
        Number(reservation.startTime.split(":")[1])
      );

      const reservationEndTime = new Date();
      reservationEndTime.setHours(Number(reservation.endTime.split(":")[0]));
      reservationEndTime.setMinutes(Number(reservation.endTime.split(":")[1]));

      const availableTimeStartTime = new Date();
      availableTimeStartTime.setHours(
        Number(availableTime.startTime.split(":")[0])
      );
      availableTimeStartTime.setMinutes(
        Number(availableTime.startTime.split(":")[1])
      );

      const availableTimeEndTime = new Date();
      availableTimeEndTime.setHours(
        Number(availableTime.endTime.split(":")[0])
      );
      availableTimeEndTime.setMinutes(
        Number(availableTime.endTime.split(":")[1])
      );

      if (
        !isWithinInterval(reservationStartTime, {
          start: availableTimeStartTime,
          end: availableTimeEndTime,
        }) ||
        !isWithinInterval(reservationEndTime, {
          start: availableTimeStartTime,
          end: availableTimeEndTime,
        })
      ) {
        alert("予約可能な時間ではありません。予約日時を選び直してください。");
        prevStep();
        return false;
        // startTimeとendTimeが同じだったらavailableTimeを削除して終了
      } else if (
        reservation.startTime === availableTime.startTime &&
        reservation.endTime === availableTime.endTime
      ) {
        deleteSubCollectionDocument(
          "stuffs",
          selectedStuffId,
          "available_times",
          availableTime.id
        );
        return true;
        // reservationのstartTimeがavailableTimeと同じ場合
      } else if (reservation.startTime === availableTime.startTime) {
        // availableTimeのstartTimeをreservationのendTimeに更新して終了
        updateSubCollectionDocument(
          {
            startTime: reservation.endTime,
          } as AvailableTime,
          "stuffs",
          selectedStuffId,
          "available_times",
          availableTime.id
        );
        return true;
      } else if (reservation.endTime === availableTime.endTime) {
        // reservationのendTimeがavailableTimeのEndTimeと同じ場合
        // availableTimeのendTimeをreservationのstartTimeに更新して終了
        updateSubCollectionDocument(
          {
            endTime: reservation.startTime,
          } as AvailableTime,
          "stuffs",
          selectedStuffId,
          "available_times",
          availableTime.id
        );
        return true;
      } else {
        // それ以外の場合
        // availableTimeのendTimeをreservationのstartTimeに更新
        updateSubCollectionDocument(
          {
            endTime: reservation.startTime,
          } as AvailableTime,
          "stuffs",
          selectedStuffId,
          "available_times",
          availableTime.id
        );
        // 新しいavailableTimeを作成して、
        // reservationのendTimeをavailableTimeのstartTimeに、大元のendTimeをavailableTimeのendTimeに更新して終了
        addSubCollectionDocument(
          {
            date: availableTime.date,
            startTime: reservation.endTime,
            endTime: availableTime.endTime,
          } as AvailableTime,
          "stuffs",
          selectedStuffId,
          "available_times"
        );
        return true;
      }
    });
  };

  useEffect(() => {
    getDocuments("stuffs").then((res) => {
      setStuffs(res as Stuff[]);
    });

    if (uid !== "") {
      getDocument("customers", uid ?? "").then((res) => {
        setCustomer(res as Customer);
      });
    }
  }, [uid]);

  return (
    <>
      <Container className="m-auto">
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          mt={20}
          mb={30}
        >
          <Stepper.Step
            label="First step"
            description="スタッフを選択してください"
          >
            {stuffs.map((stuff) => (
              <div key={`${stuff.lastName}_${stuff.firstName}`}>
                <Grid className="mt-5">
                  <Grid.Col>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Image
                          src={stuff.profileImageUrl}
                          fit="cover"
                          alt="Norway"
                        />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text
                          weight={500}
                        >{`${stuff.lastName} ${stuff.firstName}`}</Text>
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
                    const selected = {
                      startTime:
                        startTime !== "" ? startTime : availableTime.startTime,
                      endTime: format(
                        calcEndTime(
                          selectedCourse?.time ?? "",
                          startTime !== "" ? startTime : availableTime.startTime
                        ),
                        "HH:mm"
                      ),
                      date: targetDate ?? Timestamp.fromDate(new Date()),
                    } as AvailableTime;
                    setSelectedAvailableTime(selected);
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
              onClick={async () => {
                addDocument(
                  {
                    customerId: uid ?? "",
                    stuffId: selectedStuff?.id ?? "",
                    course: selectedCourse?.title ?? "",
                    date: selectedAvailableTime?.date ?? "",
                    startTime: selectedAvailableTime?.startTime,
                    endTime: selectedAvailableTime?.endTime,
                  } as Reservation,
                  "reservations"
                );

                const reservation = {
                  startTime: selectedAvailableTime?.startTime,
                  endTime: selectedAvailableTime?.endTime,
                } as Reservation;

                const flag = await calcAvailableTime(
                  targetDateAvailableTimes,
                  reservation,
                  selectedStuff?.id ?? ""
                );

                if (!flag) return; // 予約可能時間外の場合

                getDocument("customers", uid ?? "").then((res) => {
                  const customer = res.data() as Customer;
                  sendMail(
                    customer?.email ?? "",
                    customer?.firstName ?? "",
                    customer?.lastName ?? "",
                    format(targetDate?.toDate() ?? new Date(), "yyyy/MM/dd"),
                    reservation.startTime,
                    reservation.endTime,
                    selectedCourse?.title ?? "",
                    selectedCourse?.amount ?? ""
                  );
                });

                nextStep();
              }}
            >
              この内容で予約する
            </Button>
          </Stepper.Step>
          <Stepper.Completed>
            お客様のご予約が完了しました！ご予約内容をメールで送信しましたのでご確認ください。
            <br />
            ご来店心よりお待ちしております。
            <br />
            ※迷惑メールに届いている可能性もありますのでご注意ください。
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          {active === 4 ? (
            <Button component={Link} href="/" variant="default">
              トップページに戻る
            </Button>
          ) : (
            <Button variant="default" onClick={prevStep}>
              一つ前のステップに戻る
            </Button>
          )}
        </Group>
        {loading ? <Loading /> : <></>}
      </Container>
    </>
  );
}
