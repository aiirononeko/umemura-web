"use client";

import { useEffect, useMemo, useState } from "react";
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
  TextInput,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import {
  AvailableTime,
  Course,
  Reservation,
  Stuff,
  addDocument,
  deleteSubCollectionDocument,
  getDocuments,
  getSubcollectionDocuments,
  updateSubCollectionDocument,
} from "../firebase/service/collection";
import { format, addMinutes, isWithinInterval } from "date-fns";
import { Timestamp, addDoc, collection, setDoc } from "firebase/firestore";
import { Loading } from "../firebase/service/loading";
import { addSubCollectionDocument } from "../firebase/service/collection";
import sendMail from "./sendMail";
import { useForm } from "@mantine/form";
import { db } from "../firebase/config";
import sendMailToStuff from "./sendMailToStuff";

export default function Reservation() {
  const [loading, setLoading] = useState(false);

  const deviceWidth = window.innerWidth;

  const form = useForm({
    initialValues: {
      customerName: "",
      customerPhoneNumber: "",
      customerEmail: "",
    },
  });

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [customerName, setCustomerName] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
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
    availableTime: AvailableTime,
    reservation: Reservation,
    selectedStuffId: string
  ): Promise<boolean> => {
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
  };

  const [reservations, setReservations] = useState<Reservation[]>();

  const confirmReservations = async (
    targetDate: Date,
    availableStartTime: String,
    availableEndTime: String
  ): Promise<boolean> => {
    // 同じ日にちの予約をフィルターする
    const filteredReservations = reservations
      ?.filter((reservation) => {
        return (
          reservation.date.toDate().getFullYear() ===
            targetDate.getFullYear() &&
          reservation.date.toDate().getMonth() === targetDate.getMonth() &&
          reservation.date.toDate().getDate() === targetDate.getDate()
        );
      })
      .filter((reservation) => {
        const reservationStartTime = new Date();
        reservationStartTime.setHours(
          Number(reservation.startTime.split(":")[0])
        );
        reservationStartTime.setMinutes(
          Number(reservation.startTime.split(":")[1])
        );

        const reservationEndTime = new Date();
        reservationEndTime.setHours(Number(reservation.endTime.split(":")[0]));
        reservationEndTime.setMinutes(
          Number(reservation.endTime.split(":")[1])
        );

        const availableTimeStartTime = new Date();
        availableTimeStartTime.setHours(
          Number(availableStartTime.split(":")[0])
        );
        availableTimeStartTime.setMinutes(
          Number(availableStartTime.split(":")[1])
        );

        const availableTimeEndTime = new Date();
        availableTimeEndTime.setHours(Number(availableEndTime.split(":")[0]));
        availableTimeEndTime.setMinutes(Number(availableEndTime.split(":")[1]));

        // 予約しようとしている時間帯に登録されている予約を抽出
        return (
          isWithinInterval(availableTimeStartTime, {
            start: reservationStartTime,
            end: reservationEndTime,
          }) ||
          isWithinInterval(availableTimeEndTime, {
            start: reservationStartTime,
            end: reservationEndTime,
          })
        );
      });

    // 選択した時間の範囲内にある予約が2個以下なら予約可能、2個なら予約不可
    if (filteredReservations?.length) {
      console.log(filteredReservations?.length < 2);
      return filteredReservations?.length < 2;
    } else {
      return true; // まだ予約がないのでtrue
    }
  };

  useEffect(() => {
    getDocuments("stuffs").then((res) => {
      setStuffs(res as Stuff[]);
    });

    getDocuments("reservations").then((res) => {
      setReservations(res as Reservation[]);
    });
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useMemo(() => {
    if (deviceWidth <= 700) {
      setIsMobile(true);
    }
  }, [deviceWidth]);

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
            <Grid className="mt-5">
              {stuffs.map((stuff) => (
                <Grid.Col span={isMobile ? 12 : 6} key={stuff.email}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                      <Image
                        src={stuff.profileImageUrl}
                        fit="cover"
                        alt="Norway"
                        height={400}
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
              ))}
            </Grid>
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="コースを選択してください"
          >
            {courses
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
              .map((course) => (
                <div key={`${course.title}`}>
                  <Grid className="mt-5">
                    <Grid.Col>
                      <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group position="apart" mt="md" mb="xs">
                          <Text weight={500}>{course.title}</Text>
                        </Group>

                        <Text size="sm" color="dimmed">
                          {course.description}
                        </Text>

                        {Number(course.discount) === 0 ? (
                          <Text size="sm" color="dimmed">
                            料金: {course.amount}円(税込)
                          </Text>
                        ) : (
                          <Text size="sm" color="dimmed">
                            料金:
                            <span
                              style={{
                                textDecoration: "line-through",
                                textDecorationStyle: "solid",
                                textDecorationColor: "red",
                              }}
                            >
                              {course.amount}円(税込)
                            </span>
                            <span
                              style={{
                                color: "red",
                              }}
                            >
                              {course.discount}円(税込)
                            </span>
                          </Text>
                        )}

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
                                    availableTime.date
                                      .toDate()
                                      .getFullYear() === today.getFullYear() &&
                                    availableTime.date.toDate().getMonth() ===
                                      today.getMonth() &&
                                    availableTime.date.toDate().getDate() ===
                                      today.getDate()
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
                        availableTime.date.toDate().getDate() ===
                          date?.getDate()
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
            label="Fourth step"
            description="お客様情報を入力してください"
          >
            <form
              onSubmit={form.onSubmit((values) => {
                setCustomerName(values.customerName);
                setCustomerEmail(values.customerEmail);
                setCustomerPhoneNumber(values.customerPhoneNumber);
                nextStep();
              })}
            >
              <TextInput
                label="お客様の氏名"
                placeholder="整体 太郎"
                required
                {...form.getInputProps("customerName")}
                mb="lg"
              />
              <TextInput
                label="お客様の電話番号"
                placeholder="08012345678"
                required
                {...form.getInputProps("customerPhoneNumber")}
                mb="lg"
              />
              <TextInput
                label="お客様のメールアドレス"
                placeholder="holistic@example.com"
                required
                {...form.getInputProps("customerEmail")}
                mb="lg"
              />

              <Button
                type="submit"
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
              >
                この内容で進む
              </Button>
            </form>
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
                setLoading(true);

                // 予約可能かどうかを確認
                setTimeout(() => {
                  confirmReservations(
                    selectedAvailableTime?.date.toDate() ?? new Date(),
                    selectedAvailableTime?.startTime ?? "",
                    selectedAvailableTime?.endTime ?? ""
                  ).then((canReserve) => {
                    if (!canReserve) {
                      setLoading(false);
                      alert(
                        "大変申し訳ございません。指定いただいた日時は予約がいっぱいですので、別の時間帯を指定ください。"
                      );
                      prevStep();
                      return;
                    }

                    const reservation = {
                      startTime: selectedAvailableTime?.startTime,
                      endTime: selectedAvailableTime?.endTime,
                    } as Reservation;

                    calcAvailableTime(
                      selectedAvailableTime ?? targetDateAvailableTimes[0],
                      reservation,
                      selectedStuff?.id ?? ""
                    ).then(flag => {
                          if (!flag) {
                      setLoading(false);
                      return;
                    } else {
                      addDocument(
                        {
                          customerName,
                          customerPhoneNumber,
                          customerEmail,
                          stuffId: selectedStuff?.id ?? "",
                          course: selectedCourse?.title ?? "",
                          date: selectedAvailableTime?.date ?? "",
                          startTime: selectedAvailableTime?.startTime,
                          endTime: selectedAvailableTime?.endTime,
                        } as Reservation,
                        "reservations"
                      );

                      /**
                       * ユーザーにメール送信
                       */
                      sendMail(
                        customerEmail ?? "",
                        customerName ?? "",
                        format(
                          targetDate?.toDate() ?? new Date(),
                          "yyyy/MM/dd"
                        ),
                        reservation.startTime,
                        reservation.endTime,
                        selectedCourse?.title ?? "",
                        selectedCourse?.amount ?? ""
                      )
                        .then((res) => {
                          setLoading(false);
                          nextStep();
                        })
                        .catch((err) => {
                          setLoading(false);
                          // TODO: メールの送信に失敗した場合の処理
                          // nextStep();
                          console.log(err);
                        });

                      /**
                       * スタッフにメール送信
                       */
                      sendMailToStuff(
                        selectedStuff?.email ?? "",
                        customerName ?? "",
                        format(
                          targetDate?.toDate() ?? new Date(),
                          "yyyy/MM/dd"
                        ),
                        reservation.startTime,
                        reservation.endTime,
                        selectedCourse?.title ?? "",
                        selectedCourse?.amount ?? ""
                      )
                        .then((res) => {
                          setLoading(false);
                          nextStep();
                        })
                        .catch((err) => {
                          setLoading(false);
                          // // TODO: メールの送信に失敗した場合の処理
                          // nextStep();
                          console.log(err);
                        });
                    }
                      });
                  });
                }, 3000);
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
          {active === 5 ? (
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
