"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../firebase/config";
import {
  collection,
  setDoc,
  query,
  where,
  getDocs,
  doc,
  DocumentSnapshot,
} from "firebase/firestore";
import { set, add, format } from "date-fns";

export default function AvailableTimeRegister() {
  const [mondayAvailableTimes, setMondayAvailableTimes] =
    useState<DocumentSnapshot[]>();
  const [tuesdayAvailableTimes, setTuesdayAvailableTimes] =
    useState<DocumentSnapshot[]>();
  const [wednesdayAvailableTimes, setWednesdayAvailableTimes] =
    useState<DocumentSnapshot[]>();
  const [thirdsdayAvailableTimes, setThirdsdayAvailableTimes] =
    useState<DocumentSnapshot[]>();
  const [fridayAvailableTimes, setFridayAvailableTimes] =
    useState<DocumentSnapshot[]>();
  const [saturdayAvailableTimes, setSaturdayAvailableTimes] =
    useState<DocumentSnapshot[]>();
  const [sundayAvailableTimes, setSundayAvailableTimes] =
    useState<DocumentSnapshot[]>();

  const getAvailableTimes = async (date: string) => {
    try {
      const availableTimes: any = [];
      const q = query(
        collection(db, "available_times"),
        where("date", "==", date)
      );
      const docRef = await getDocs(q);
      docRef.forEach((doc) => {
        availableTimes.push(doc);
      });
      return availableTimes;
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };

  const handleChangeAvairableTime = async (
    docId: string,
    time: string,
    avairableFlag: boolean
  ) => {
    try {
      await setDoc(doc(db, "available_times", docId), {
        [time]: !avairableFlag,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  /**
   * 今日から7日間の日付を取得する
   */
  const getSevenDaysDate = (): Date[] => {
    const nextDateArr = [];
    for (let i = 0; i < 7; i++) {
      if (i === 0) {
        nextDateArr.push(new Date());
      } else {
        nextDateArr.push(add(new Date(), { days: i }));
      }
    }
    return nextDateArr;
  };

  // 営業開始時間 - 10:00
  const startTime = set(new Date(), { hours: 10, minutes: 0 });

  const getOpenningTimes = () => {
    const openningTimes = [];
    for (let i = 0; i < 21; i++) {
      if (i === 0) {
        openningTimes.push(format(startTime, "HH:mm"));
      } else {
        openningTimes.push(
          format(add(startTime, { minutes: i * 30 }), "HH:mm")
        );
      }
    }
    return openningTimes;
  };

  const [nextDateArr, _] = useState(getSevenDaysDate());
  const [openningTimes, __] = useState(getOpenningTimes());

  useEffect(() => {
    (async () => {
      const monday = await getAvailableTimes(
        format(nextDateArr[0], "yyyy/MM/dd")
      );
      setMondayAvailableTimes(monday);

      const tuesday = await getAvailableTimes(
        format(nextDateArr[1], "yyyy/MM/dd")
      );
      setTuesdayAvailableTimes(tuesday);

      const wednesday = await getAvailableTimes(
        format(nextDateArr[2], "yyyy/MM/dd")
      );
      setWednesdayAvailableTimes(wednesday);

      const thirdsday = await getAvailableTimes(
        format(nextDateArr[3], "yyyy/MM/dd")
      );
      setThirdsdayAvailableTimes(thirdsday);

      const friday = await getAvailableTimes(
        format(nextDateArr[4], "yyyy/MM/dd")
      );
      setFridayAvailableTimes(friday);

      const saturday = await getAvailableTimes(
        format(nextDateArr[5], "yyyy/MM/dd")
      );
      setSaturdayAvailableTimes(saturday);

      const sunday = await getAvailableTimes(
        format(nextDateArr[6], "yyyy/MM/dd")
      );
      setSundayAvailableTimes(sunday);
    })();
  }, []);

  const getMondayAvailableOrNot = (time: string) => {
    if (mondayAvailableTimes) {
      return mondayAvailableTimes[0].get(time) ? "○" : "×";
    }
  };

  const getTuesdayAvailableOrNot = (time: string) => {
    if (tuesdayAvailableTimes) {
      return tuesdayAvailableTimes[0].get(time) ? "○" : "×";
    }
  };

  const getWednesdayAvailableOrNot = (time: string) => {
    if (wednesdayAvailableTimes) {
      return wednesdayAvailableTimes[0].get(time) ? "○" : "×";
    }
  };

  const getThirdsdayAvailableOrNot = (time: string) => {
    if (thirdsdayAvailableTimes) {
      return thirdsdayAvailableTimes[0].get(time) ? "○" : "×";
    }
  };

  const getFridayAvailableOrNot = (time: string) => {
    if (fridayAvailableTimes) {
      return fridayAvailableTimes[0].get(time) ? "○" : "×";
    }
  };

  const getSaturdayAvailableOrNot = (time: string) => {
    if (saturdayAvailableTimes) {
      return saturdayAvailableTimes[0].get(time) ? "○" : "×";
    }
  };

  const getSundayAvailableOrNot = (time: string) => {
    if (sundayAvailableTimes) {
      return sundayAvailableTimes[0].get(time) ? "○" : "×";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">予約可能日時登録ページ</h1>
      <table className="table-auto mb-8">
        <thead>
          <tr>
            <th className="border px-4 py-2" />
            {nextDateArr.map((date, index) => (
              <th key={index} className="border px-4 py-2">
                {format(date, "MM/dd")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {openningTimes.map((time, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{time}</td>
              {/* 月曜日の予約可能時 */}
              <td className="border px-4 py-2">
                <span>{getMondayAvailableOrNot(time)}</span>
              </td>
              {/* 火曜日の予約可能時 */}
              <td className="border px-4 py-2">
                <span> {getTuesdayAvailableOrNot(time)}</span>
              </td>
              {/* 水曜日の予約可能時 */}
              <td className="border px-4 py-2">
                <span>{getWednesdayAvailableOrNot(time)}</span>
              </td>
              {/* 木曜日の予約可能時 */}
              <td className="border px-4 py-2">
                <span> {getThirdsdayAvailableOrNot(time)}</span>
              </td>
              {/* 金曜日の予約可能時 */}
              <td className="border px-4 py-2">
                <span> {getFridayAvailableOrNot(time)}</span>
              </td>
              {/* 土曜日の予約可能時 */}
              <td className="border px-4 py-2">
                <span> {getSaturdayAvailableOrNot(time)}</span>
              </td>
              {/* 日曜日の予約可能時 */}
              <td className="border px-4 py-2">
                <span> {getSundayAvailableOrNot(time)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/admin">管理者ページへ</Link>
    </main>
  );
}
